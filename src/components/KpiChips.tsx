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
    <div className="flex gap-3 overflow-x-auto pb-2 sm:justify-center snap-x snap-mandatory">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={index}
            className="kpi-chip flex-shrink-0 snap-center"
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