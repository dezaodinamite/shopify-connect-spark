import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ | Suívie Jabuticaba";
    const desc = "Perguntas frequentes sobre produtos, entrega e conservação.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto py-10">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes</h1>
        <div className="surface radius-lg p-4 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="entrega">
              <AccordionTrigger>Quais são os prazos e valores de entrega?</AccordionTrigger>
              <AccordionContent>
                Enviamos para todo o Brasil com opções Same‑Day e Next‑Day em regiões atendidas. O valor é calculado no carrinho.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="conservacao">
              <AccordionTrigger>Como conservar o produto?</AccordionTrigger>
              <AccordionContent>
                Manter em local fresco e ao abrigo da luz. Após aberto, conservar refrigerado e consumir em até 48 horas.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ingredientes">
              <AccordionTrigger>Quais são os ingredientes?</AccordionTrigger>
              <AccordionContent>
                Jabuticaba, maçã e um toque de gengibre. Sem adição de açúcares, corantes ou conservantes artificiais.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
