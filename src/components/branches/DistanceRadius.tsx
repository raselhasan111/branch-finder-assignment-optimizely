import { Radius } from 'lucide-react';
import { RADIUS_OPTIONS } from '@/constants/config.ts';

interface DistanceRadiusProps {
  value: number | null;
  onChange: (radius: number | null) => void;
}

export default function DistanceRadius({
  value,
  onChange,
}: DistanceRadiusProps) {
  return (
    <div className="flex items-center gap-2">
      <Radius className="h-4 w-4 shrink-0 text-slate-brand" />
      <div className="flex gap-1.5">
        {RADIUS_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onChange(opt.value)}
            className={`cursor-pointer rounded-[20px] border-2 px-3 py-1.5 text-[0.8rem] font-medium transition-all duration-300 ${
              value === opt.value
                ? 'border-gold bg-midnight text-warm-white'
                : 'border-transparent bg-cream text-midnight hover:border-gold'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
