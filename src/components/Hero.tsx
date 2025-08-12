import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const fallbackImage = "https://suivie.com.br/cdn/shop/files/Header_1.png?v=1697162644&width=1920";

export default function Hero() {
  // Public URL for the video in Supabase Storage (bucket: public-media, path: suivie-hero-video.mp4)
  const videoUrl = supabase.storage
    .from("public-media")
    .getPublicUrl("suivie-hero-video.mp4").data.publicUrl;

  return (
    <section className="relative" aria-label="Hero Suívie Jabuticaba">
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="h-[70vh] w-full object-cover md:h-[85vh]"
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackImage}
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback image if video fails */}
          <img
            src={fallbackImage}
            alt="Fundo com splash de jabuticaba"
            className="h-[70vh] w-full object-cover md:h-[85vh]"
          />
        </video>
      </div>

      {/* Overlay gradient for readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative container mx-auto flex h-[70vh] flex-col items-center justify-center text-center md:h-[85vh]">
        <h1 className="max-w-5xl text-balance font-playfair text-5xl md:text-7xl font-extrabold tracking-tight text-[hsl(var(--hero-title))] animate-fade-in">
          A SUPER FRUTA QUE O MUNDO DESEJA
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground/90 animate-fade-in">
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

        {/* Highlights */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-4">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 rounded-full bg-background/40 p-4 backdrop-blur-md shadow-sm">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[hsl(var(--hero-title))]">100%</div>
              <div className="text-xs md:text-sm text-foreground/90">Natural</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[hsl(var(--hero-title))]">Rica</div>
              <div className="text-xs md:text-sm text-foreground/90">Antioxidantes</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[hsl(var(--hero-title))]">Única</div>
              <div className="text-xs md:text-sm text-foreground/90">No Mundo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
