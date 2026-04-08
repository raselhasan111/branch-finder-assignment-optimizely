import { AlertTriangle } from 'lucide-react';

export default function MapError() {
  return (
    <div className="relative h-80 w-full overflow-hidden bg-linear-to-br from-midnight to-deep-teal md:h-85 lg:h-90 xl:h-120">
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-xl rounded-[16px] border border-gold/20 bg-warm-white/95 px-6 py-7 text-center shadow-[0_12px_35px_rgba(10,22,40,0.18)] backdrop-blur-sm">
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-gold" />
          <h3 className="mb-2 text-[1.2rem] font-semibold text-midnight">
            Unable to Load Map
          </h3>
          <p className="text-[0.95rem] leading-relaxed text-slate-brand">
            The map is currently unavailable. Please try again in a moment.
          </p>
        </div>
      </div>
    </div>
  );
}
