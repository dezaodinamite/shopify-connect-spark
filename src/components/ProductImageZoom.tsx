import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
}

// Image zoom with modal popup on click
export function ProductImageZoom({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const [portalPos, setPortalPos] = useState({ top: 0, left: 0 });
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleImageClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="max-w-md mx-auto cursor-pointer"
        onClick={handleImageClick}
      >
        <div className="rounded-xl border overflow-hidden">
          <AspectRatio ratio={1}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain rounded-none"
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
              backgroundImage: `url("${src}")`,
              backgroundSize: `${ZOOM}%`,
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />,
          document.body
        )}
      </div>

      {/* Modal for fullscreen image */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
          <div className="relative flex items-center justify-center min-h-[80vh]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              aria-label="Fechar modal"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onClick={() => setModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}