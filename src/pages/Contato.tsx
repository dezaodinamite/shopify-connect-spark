import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function Contato() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Contato | Suívie Jabuticaba";
    const desc = "Fale com a Suívie: dúvidas, sugestões e suporte ao cliente.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", desc);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({ title: "Preencha todos os campos", description: "Por favor, complete o formulário." });
      return;
    }
    toast({ title: "Mensagem enviada", description: "Entraremos em contato em breve." });
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto py-10">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold mb-6">Contato</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="surface radius-lg p-4 md:p-6">
            <form onSubmit={onSubmit} className="grid gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nome</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" required />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Mensagem</label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Como podemos ajudar?" required />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="brand">Enviar</Button>
              </div>
            </form>
          </div>
          <aside className="surface radius-lg p-4 md:p-6 space-y-3">
            <h2 className="text-xl font-semibold">Informações</h2>
            <p className="text-muted-foreground">Email: contato@suivie.com.br</p>
            <p className="text-muted-foreground">Telefone: (11) 0000-0000</p>
            <p className="text-muted-foreground">Atendimento: Seg a Sex, 9h às 18h</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
