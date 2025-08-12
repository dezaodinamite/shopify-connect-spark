import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import HeroContent from "@/components/HeroContent";
import HeroHighlights from "@/components/HeroHighlights";

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
          className="h-[80vh] w-full object-cover md:h-[90vh]"
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
            className="h-[80vh] w-full object-cover md:h-[90vh]"
          />
        </video>
      </div>


      {/* Content */}
      <div className="relative container mx-auto flex h-[80vh] flex-col items-center justify-center text-center md:h-[90vh]">
        <HeroContent />
        <HeroHighlights />
      </div>
    </section>
  );
}
