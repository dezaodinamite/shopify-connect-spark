import { Leaf, Zap, Sparkles } from "lucide-react";

const kpis = [
  {
    icon: Leaf,
    title: "100% Natural",
    subtitle: "Produto puro",
  },
  {
    icon: Zap,
    title: "Rica em Antioxidantes", 
    subtitle: "Super nutrição",
  },
  {
    icon: Sparkles,
    title: "Única no Mundo",
    subtitle: "Exclusividade",
  },
];

export default function KpiChips() {
  return (
    <div className="flex flex-wrap justify-center gap-3 pb-2 sm:justify-center">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={index}
            className="kpi-chip flex-shrink-0 radius-pill px-3 py-2 backdrop-blur-md bg-background/40 border border-border/50 shadow-sm"
          >
            <IconComponent 
              className="h-5 w-5 text-muted-foreground" 
              strokeWidth={1.75} 
            />
            <div className="flex flex-col items-start">
              <span className="kpi-chip__title">{kpi.title}</span>
              <span className="kpi-chip__muted">{kpi.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}