// Handle Shopify products fetch (list and single product)
// Deno Edge Function

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function sanitizeDomain(input: string | undefined): string {
  if (!input) return ''
  try {
    // Remove protocol and any path
    const withoutProtocol = input.replace(/^https?:\/\//, '')
    return withoutProtocol.split('/')[0]
  } catch (_) {
    return input
  }
}

async function shopifyRequest(query: string, variables: Record<string, unknown> = {}) {
  const token = Deno.env.get('SHOPIFY_STOREFRONT_TOKEN')
  const rawDomain = Deno.env.get('SHOPIFY_STORE_DOMAIN')

  if (!token || !rawDomain) {
    return new Response(
      JSON.stringify({ error: 'Missing SHOPIFY_STOREFRONT_TOKEN or SHOPIFY_STORE_DOMAIN' }),
      { status: 500, headers: { 'content-type': 'application/json', ...corsHeaders } }
    )
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
  return new Response(JSON.stringify(json), {
    status: res.ok ? 200 : res.status,
    headers: { 'content-type': 'application/json', ...corsHeaders },
  })
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, handle } = await req.json().catch(() => ({ action: 'listProducts' }))

    if (action === 'getProduct' && handle) {
      const query = `#graphql
        query ProductByHandle($handle: String!) {
          product(handle: $handle) {
            id
            title
            handle
            descriptionHtml
            featuredImage { url altText }
            images(first: 8) { nodes { url altText } }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 20) { nodes { id title availableForSale } }
          }
        }
      `
      return await shopifyRequest(query, { handle })
    }

    // Default: list products
    const query = `#graphql
      query ListProducts {
        products(first: 24, sortKey: UPDATED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            description
            featuredImage { url altText }
            priceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) { nodes { id } }
          }
        }
      }
    `
    return await shopifyRequest(query)
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    })
  }
})
