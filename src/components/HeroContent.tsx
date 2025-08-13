import { Button } from "@/components/ui/button";
import KpiChips from "@/components/KpiChips";

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <h1 className="max-w-5xl text-balance font-playfair text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[hsl(var(--hero-title))] animate-fade-in">
        A <span className="text-[hsl(var(--accent-orange))] text-4xl sm:text-5xl md:text-7xl lg:text-8xl">superfruta</span> que o mundo deseja
      </h1>
      <p className="mt-3 max-w-2xl text-base md:text-xl text-[hsl(var(--hero-subtitle))] animate-fade-in">
        Descubra a <span className="font-semibold text-[hsl(var(--accent-orange))]">Jabuticaba</span>, mais rica em antioxidantes que mirtilos, uvas e até o açaí.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row animate-fade-in">
        <Button asChild size="lg" variant="brand" className="!rounded-full px-10 py-6 hover-scale shadow-md w-full sm:w-auto">
          <a href="#produtos" aria-label="Experimentar agora">Experimentar Agora</a>
        </Button>
        <Button asChild size="lg" variant="outline" className="!rounded-full px-10 py-6 hover-scale">
          <a href="#sobre" aria-label="Conhecer a Jabuticaba">Conhecer a Jabuticaba</a>
        </Button>
      </div>
      
      {/* KPIs Section - Minimalist Chips */}
      <div className="mt-16 max-w-4xl mx-auto">
        <KpiChips />
      </div>
    </div>
  );
}