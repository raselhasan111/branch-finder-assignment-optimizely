import { Radius } from 'lucide-react';

interface DistanceRadiusProps {
  value: number | null;
  onChange: (radius: number | null) => void;
}

const RADIUS_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: 'Any Distance' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
  { value: 250, label: '250 km' },
];

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
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
