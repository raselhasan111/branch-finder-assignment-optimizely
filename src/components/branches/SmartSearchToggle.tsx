import { Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface SmartSearchToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function SmartSearchToggle({
  enabled,
  onChange,
}: SmartSearchToggleProps) {
  return (
    <div
      className="flex items-center gap-1 sm:gap-2"
      title="Semantic Search"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      <label
        htmlFor="smart-search"
        className="flex cursor-pointer items-center gap-1 sm:gap-1.5 text-[0.95rem] font-medium text-midnight"
      >
        <Sparkles
          className={`h-4 w-4 transition-colors duration-300 ${enabled ? 'text-gold' : 'text-slate-brand'}`}
        />
        <span className="hidden sm:inline">Smart Search</span>
      </label>
      <Switch
        id="smart-search"
        size="lg"
        checked={enabled}
        onCheckedChange={onChange}
        className="data-checked:border-gold data-checked:bg-cream data-unchecked:border-slate-brand/20 data-unchecked:bg-warm-white [&[data-checked]>[data-slot=switch-thumb]]:bg-gold [&[data-unchecked]>[data-slot=switch-thumb]]:bg-slate-brand/40"
      />
    </div>
  );
}
