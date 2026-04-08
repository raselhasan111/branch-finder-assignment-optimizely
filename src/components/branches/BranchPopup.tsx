import { OverlayViewF } from '@react-google-maps/api';
import { MapPin, Phone, Mail, Navigation, X } from 'lucide-react';
import type { Branch } from '@/types/branch';
import { getDirectionsUrl } from '@/lib/map-utils';
import { parseCoordinates } from '@/lib/utils.ts';

interface BranchPopupProps {
  selectedBranch: Branch | null;
  onClose: () => void;
}

export default function BranchPopup({
  selectedBranch,
  onClose,
}: BranchPopupProps) {
  if (!selectedBranch) return null;

  const [lat, lng] = parseCoordinates(selectedBranch.Coordinates);
  if (lat == null || lng == null) return null;

  return (
    <OverlayViewF position={{ lat, lng }} mapPaneName="floatPane">
      <div className="relative -mt-12 -translate-x-1/2 -translate-y-full rounded-[14px] border border-gold/15 bg-warm-white px-4.5 pt-4 pb-3.5 shadow-[0_4px_20px_rgba(10,22,40,0.12),0_1px_4px_rgba(10,22,40,0.08)] min-w-52.5 w-max">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[6px] border-none bg-midnight/6 p-0 text-slate-brand transition-[background] duration-150 hover:bg-midnight/12"
        >
          <X size={13} strokeWidth={2.5} />
        </button>

        {/* Gold accent bar */}
        <div className="mb-2.5 h-0.75 w-7 rounded-sm bg-gold" />

        <h3 className="mb-2.5 pr-5 text-[1.05rem] font-bold leading-[1.3] tracking-[-0.3px] text-midnight">
          {selectedBranch.Name ?? 'Unknown Branch'}
        </h3>

        <div className="mb-3 flex flex-col gap-1.5">
          <div className="flex items-start gap-1.75 text-[0.82rem] leading-[1.45] text-[#4a5568]">
            <MapPin size={13} className="mt-0.5 shrink-0 text-gold" />
            <span>
              {[
                selectedBranch.Street,
                selectedBranch.City,
                selectedBranch.Country,
              ]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>

          {selectedBranch.Phone && (
            <div className="flex items-center gap-1.75 text-[0.82rem]">
              <Phone size={12} className="shrink-0 text-gold" />
              <a
                href={`tel:${selectedBranch.Phone}`}
                className="border-b border-dashed border-[#4a5568]/30 text-[#4a5568] no-underline transition-colors duration-150 hover:text-midnight"
              >
                {selectedBranch.Phone}
              </a>
            </div>
          )}

          {selectedBranch.Email && (
            <div className="flex items-center gap-1.75 text-[0.82rem]">
              <Mail size={12} className="shrink-0 text-gold" />
              <a
                href={`mailto:${selectedBranch.Email}`}
                className="border-b border-dashed border-[#4a5568]/30 text-[#4a5568] no-underline transition-colors duration-150 hover:text-midnight"
              >
                {selectedBranch.Email}
              </a>
            </div>
          )}
        </div>

        <a
          href={getDirectionsUrl(lat, lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-[20px] bg-gold px-4 py-1.75 text-[0.78rem] font-semibold tracking-[0.3px] text-midnight no-underline transition-[background] duration-200 hover:bg-[#c9a430]"
        >
          <Navigation size={11} />
          Get Directions
        </a>

        {/* Tail triangle */}
        <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[9px] border-x-transparent border-t-warm-white drop-shadow-[0_2px_2px_rgba(10,22,40,0.06)]" />
      </div>
    </OverlayViewF>
  );
}
