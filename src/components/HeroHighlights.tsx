export default function HeroHighlights() {
  return (
    <div className="pointer-events-none absolute bottom-1/4 left-1/2 w-full -translate-x-1/2 px-4">
      <div className="mx-auto max-w-4xl rounded-3xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-3 gap-4 bg-white/20 backdrop-blur-md p-6 rounded-3xl">
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
  );
}