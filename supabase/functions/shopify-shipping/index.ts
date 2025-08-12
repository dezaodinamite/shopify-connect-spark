// Get Shopify shipping options by CEP using Storefront API
// Deno Edge Function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function sanitizeDomain(input: string | undefined): string {
  if (!input) return ''
  try {
    const withoutProtocol = input.replace(/^https?:\/\//, '')
    return withoutProtocol.split('/')[0]
  } catch (_) {
    return input
  }
}

async function shopifyFetch(query: string, variables: Record<string, unknown> = {}) {
  const token = Deno.env.get('SHOPIFY_STOREFRONT_TOKEN')
  const rawDomain = Deno.env.get('SHOPIFY_STORE_DOMAIN')

  if (!token || !rawDomain) {
    throw new Error('Missing SHOPIFY_STOREFRONT_TOKEN or SHOPIFY_STORE_DOMAIN')
  }

  const domain = sanitizeDomain(rawDomain)
  const endpoint = `https://${domain}/api/2024-07/graphql.json`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()
  if (!res.ok) {
    console.error('Shopify error:', json)
    throw new Error(`Shopify request failed: ${res.status}`)
  }
  return json
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const lines = Array.isArray(body?.lines) ? body.lines : []
    const postalCodeRaw = String(body?.postalCode || '')

    if (!postalCodeRaw || !/^[0-9]{8}$/.test(postalCodeRaw)) {
      return new Response(JSON.stringify({ error: 'postalCode (CEP) inválido. Envie apenas 8 dígitos.' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      })
    }
    if (!lines.length) {
      return new Response(JSON.stringify({ error: 'Nenhuma linha para calcular frete.' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      })
    }

    // 1) Create cart
    const createMutation = `#graphql
      mutation CartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart { id }
          userErrors { field message }
        }
      }
    `
    const createRes = await shopifyFetch(createMutation, { lines })
    const createData = createRes?.data?.cartCreate
    const cartId = createData?.cart?.id as string | undefined
    if (!cartId) {
      console.error('cartCreate userErrors:', createData?.userErrors)
      throw new Error('Falha ao criar carrinho na Shopify')
    }

    // 2) Ensure country code
    const buyerMutation = `#graphql
      mutation CartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
          cart { id }
          userErrors { field message }
        }
      }
    `
    await shopifyFetch(buyerMutation, { cartId, buyerIdentity: { countryCode: 'BR' } })

    // 3) Update delivery address with CEP
    const addressMutation = `#graphql
      mutation CartDeliveryAddressUpdate($cartId: ID!, $deliveryAddress: MailingAddressInput!) {
        cartDeliveryAddressUpdate(cartId: $cartId, deliveryAddress: $deliveryAddress) {
          cart {
            id
            deliveryGroups(first: 10) {
              edges {
                node {
                  deliveryOptions {
                    handle
                    title
                    estimatedCost { amount currencyCode }
                  }
                }
              }
            }
          }
          userErrors { field message }
        }
      }
    `

    const addressVars = {
      cartId,
      deliveryAddress: {
        countryCode: 'BR',
        postalCode: postalCodeRaw,
      },
    }

    const addrRes = await shopifyFetch(addressMutation, addressVars)
    const updateData = addrRes?.data?.cartDeliveryAddressUpdate
    if (!updateData?.cart) {
      console.error('cartDeliveryAddressUpdate userErrors:', updateData?.userErrors)
      throw new Error('Falha ao atualizar endereço de entrega')
    }

    const groups = updateData.cart.deliveryGroups?.edges || []
    const options: { handle: string; title: string; amount: number; currencyCode: string }[] = []
    for (const edge of groups) {
      const opts = edge?.node?.deliveryOptions || []
      for (const o of opts) {
        const amount = parseFloat(o?.estimatedCost?.amount || '0')
        const currencyCode = o?.estimatedCost?.currencyCode || 'BRL'
        if (o?.handle && o?.title) {
          options.push({ handle: o.handle, title: o.title, amount, currencyCode })
        }
      }
    }

    return new Response(JSON.stringify({ options }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    })
  } catch (e) {
    console.error('shopify-shipping error:', e)
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    })
  }
})
