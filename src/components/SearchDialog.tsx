import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  featuredImage?: { url: string; altText?: string } | null;
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ProductNode[]>([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || loaded) return;
    (async () => {
      const { data } = await supabase.functions.invoke("shopify-products", {
        body: { action: "listProducts" },
      });
      const nodes: ProductNode[] = (data as any)?.data?.products?.nodes ?? [];
      setItems(nodes);
      setLoaded(true);
    })();
  }, [open, loaded]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 10);
    return items.filter((p) => p.title.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q)).slice(0, 20);
  }, [items, query]);

  const go = (handle: string) => {
    setOpen(false);
    setQuery("");
    navigate(`/product/${handle}`);
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => setOpen(true)} aria-label="Buscar produtos (Ctrl+K)">
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar produtos..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
          <CommandGroup heading="Produtos">
            {filtered.map((p) => (
              <CommandItem key={p.id} onSelect={() => go(p.handle)} value={`${p.title} ${p.handle}`}>
                <div className="flex items-center gap-3">
                  {p.featuredImage?.url && (
                    <img
                      src={p.featuredImage.url}
                      alt={p.featuredImage.altText || p.title}
                      className="h-8 w-8 rounded-md object-cover bg-secondary"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className="text-xs text-muted-foreground">/{p.handle}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
