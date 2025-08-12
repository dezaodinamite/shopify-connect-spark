import { Button } from "@/components/ui/button";
import { Leaf, Zap, Sparkles } from "lucide-react";

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
      
      {/* Modern KPIs Section */}
      <div className="mt-12 w-full px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="kpi-card group">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold">100%</div>
                <div className="text-sm md:text-base font-medium">Natural</div>
              </div>
            </div>
            
            <div className="kpi-card antioxidants group">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold">Rica</div>
                <div className="text-sm md:text-base font-medium">Antioxidantes</div>
              </div>
            </div>
            
            <div className="kpi-card unique group">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold">Única</div>
                <div className="text-sm md:text-base font-medium">No Mundo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}