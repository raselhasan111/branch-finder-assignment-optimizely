import { MapPin } from 'lucide-react';

export default function MapPlaceholder() {
  return (
    <div
      className="relative h-[320px] md:h-[340px] lg:h-[360px] xl:h-[480px] w-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628, #0d4d56)' }}
    >
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(254,253,251,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(254,253,251,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Decorative pins */}
      <div className="absolute left-[30%] top-[35%] flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold shadow-md">
          <div className="h-3 w-3 rounded-full bg-warm-white" />
        </div>
        <div className="-mt-1 h-4 w-4 rounded-full bg-gold/20 blur-[2px]" />
      </div>
      <div className="absolute left-[55%] top-[50%] flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold shadow-md">
          <div className="h-3 w-3 rounded-full bg-warm-white" />
        </div>
        <div className="-mt-1 h-4 w-4 rounded-full bg-gold/20 blur-[2px]" />
      </div>
      <div className="absolute left-[70%] top-[30%] flex flex-col items-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/60 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-warm-white" />
        </div>
      </div>
      <div className="absolute left-[20%] top-[65%] flex flex-col items-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/60 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-warm-white" />
        </div>
      </div>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <MapPin className="mb-3 h-10 w-10 text-gold" />
        <p
          className="text-center text-[1.5rem] font-medium uppercase tracking-[3px] text-sage"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Interactive Map Coming Soon
        </p>
      </div>
    </div>
  );
}
