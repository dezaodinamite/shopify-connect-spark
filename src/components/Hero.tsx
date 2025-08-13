import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import HeroContent from "@/components/HeroContent";

const fallbackImage = "https://suivie.com.br/cdn/shop/files/Header_1.png?v=1697162644&width=1920";

export default function Hero() {
  // Public URL for the video in Supabase Storage (bucket: public-media, path: suivie-hero-video.mp4)
  const videoUrl = supabase.storage
    .from("public-media")
    .getPublicUrl("suivie-hero-video.mp4").data.publicUrl;

  return (
    <section className="relative rounded-none" aria-label="Hero Suívie Jabuticaba">
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden rounded-none">
        <video
          className="h-[70vh] w-full object-cover object-center md:h-[80vh] lg:h-[85vh] rounded-none"
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
            className="h-[70vh] w-full object-cover md:h-[80vh] lg:h-[85vh]"
          />
        </video>
        {/* Subtle dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 rounded-none" />
      </div>


      {/* Content */}
      <div className="relative container mx-auto flex h-[70vh] flex-col items-center justify-center text-center md:h-[80vh] lg:h-[85vh] px-4 rounded-none">
        <HeroContent />
      </div>
    </section>
  );
}
