import { Button } from "@/components/ui/button";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="max-w-5xl text-balance font-playfair text-5xl md:text-7xl font-extrabold tracking-tight text-[hsl(var(--hero-title))] animate-fade-in">
        A SUPER FRUTA QUE O MUNDO DESEJA
      </h1>
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-white !text-white animate-fade-in" style={{ color: 'white' }}>
        Descubra a <strong>jabuticaba</strong>, a fruta brasileira mais rica em antioxidantes que existe. Mais que mirtilos, uvas e até mesmo açaí.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in">
        <Button asChild size="lg" variant="brand" className="rounded-full px-8 py-6 hover-scale shadow-md">
          <a href="#produtos" aria-label="Experimentar agora">Experimentar Agora</a>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 hover-scale">
          <a href="#sobre" aria-label="Conhecer a Jabuticaba">Conhecer a Jabuticaba</a>
        </Button>
      </div>
    </div>
  );
}