import type { featureProps } from "../types";

export default function Feature({ i, card }: featureProps) {
  return (
    <div key={i} className="border border-stone-800 bg-stone-950 p-6 relative">
      {/* Dither overlay */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[8px_8px]" />

      <div className="relative space-y-2">
        <h3 className="text-[13px] font-[Playfair_Display] tracking-tight text-white">
          {card.title}
        </h3>
        <p className="text-[11px] text-stone-400 leading-relaxed font-light">
          {card.text}
        </p>
      </div>
    </div>
  );
}
