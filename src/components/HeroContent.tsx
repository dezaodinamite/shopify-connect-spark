import { Button } from "@/components/ui/button";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <h1 className="max-w-5xl text-balance font-playfair text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[hsl(var(--hero-title))] animate-fade-in">
        A SUPER FRUTA QUE O MUNDO DESEJA
      </h1>
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-white !text-white animate-fade-in" style={{ color: 'white' }}>
        Descubra a <strong>jabuticaba</strong>, a fruta brasileira mais rica em antioxidantes que existe. Mais que mirtilos, uvas e até mesmo açaí.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-in">
        <Button asChild size="lg" variant="brand" className="!rounded-full px-10 py-6 hover-scale shadow-md">
          <a href="#produtos" aria-label="Experimentar agora">Experimentar Agora</a>
        </Button>
        <Button asChild size="lg" variant="outline" className="!rounded-full px-10 py-6 hover-scale">
          <a href="#sobre" aria-label="Conhecer a Jabuticaba">Conhecer a Jabuticaba</a>
        </Button>
      </div>
      
      {/* Highlights moved here for better organization */}
      <div className="mt-12 w-full px-4">
        <div className="mx-auto max-w-4xl rounded-3xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-3 gap-4 bg-white/20 backdrop-blur-md p-6 rounded-[2rem]">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[hsl(var(--hero-title))]">100%</div>
              <div className="text-xs md:text-sm text-brand-foreground">Natural</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[hsl(var(--hero-title))]">Rica</div>
              <div className="text-xs md:text-sm text-brand-foreground">Antioxidantes</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[hsl(var(--hero-title))]">Única</div>
              <div className="text-xs md:text-sm text-brand-foreground">No Mundo</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}