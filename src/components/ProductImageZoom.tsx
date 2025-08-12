import React, { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Props {
  src: string;
  alt: string;
}

// Zoom pop-up with draggable/hover navigation
export function ProductImageZoom({ src, alt }: Props) {
  const [pos, setPos] = useState({ x: 50, y: 50 }); // background position in %
  const zoom = 220; // percentage

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="max-w-md mx-auto">
          <AspectRatio ratio={1}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full rounded-xl object-contain bg-card p-6 shadow hover-scale"
              loading="eager"
            />
          </AspectRatio>
        </div>
      </HoverCardTrigger>
      <HoverCardContent align="center" sideOffset={10} className="w-[28rem] md:w-[40rem] h-[28rem] md:h-[40rem] p-0 overflow-hidden">
        <div
          role="img"
          aria-label={alt}
          className="w-full h-full cursor-crosshair"
          onMouseMove={handleMove}
          onTouchMove={handleTouchMove}
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${zoom}% auto`,
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      </HoverCardContent>
    </HoverCard>
  );
}
