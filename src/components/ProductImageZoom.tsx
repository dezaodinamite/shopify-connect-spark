import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Props {
  src: string;
  alt: string;
}

// Improved zoom: follows cursor and appears slightly above/right of it
export function ProductImageZoom({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });

  const ZOOM = 220; // background-size percentage
  const BOX = 384; // zoom box size in px (responsive enough)
  const OFFSET = { x: 24, y: -24 }; // slightly to the right and above the cursor

  const updateFromEvent = (clientX: number, clientY: number) => {
    const host = containerRef.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();

    // Percent position inside the original image
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    setBgPos({
      x: Math.min(100, Math.max(0, xPct)),
      y: Math.min(100, Math.max(0, yPct)),
    });

    // Position the zoom box near the cursor, clamped to viewport
    const rawLeft = clientX + OFFSET.x;
    const rawTop = clientY + OFFSET.y - BOX * 0.5; // a bit above cursor center

    const maxLeft = window.innerWidth - BOX - 8;
    const maxTop = window.innerHeight - BOX - 8;

    setPortalPos({
      left: Math.max(8, Math.min(maxLeft, rawLeft)),
      top: Math.max(8, Math.min(maxTop, rawTop)),
    });
  };

  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setVisible(true);
    updateFromEvent(e.clientX, e.clientY);
  };

  const onMouseLeave = () => setVisible(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateFromEvent(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (!t) return;
    setVisible(true);
    updateFromEvent(t.clientX, t.clientY);
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (!t) return;
    updateFromEvent(t.clientX, t.clientY);
  };
  const onTouchEnd = () => setVisible(false);

  return (
    <div
      ref={containerRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="max-w-md mx-auto"
    >
      <div className="rounded-xl border overflow-hidden">
        <AspectRatio ratio={1}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </AspectRatio>
      </div>

      {visible && createPortal(
        <div
          role="img"
          aria-label={alt}
          className="pointer-events-none fixed z-50 hidden md:block rounded-xl border bg-background shadow-lg"
          style={{
            top: portalPos.top,
            left: portalPos.left,
            width: BOX,
            height: BOX,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${ZOOM}% auto`,
            backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          }}
        />,
        document.body
      )}
    </div>
  );
}
