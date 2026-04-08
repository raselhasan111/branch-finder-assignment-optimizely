import { OverlayViewF } from '@react-google-maps/api';
import type { HoveredCluster } from '@/types/branch';

interface ClusterTooltipProps {
  hoveredCluster: HoveredCluster | null;
}

export default function ClusterTooltip({
  hoveredCluster,
}: ClusterTooltipProps) {
  if (!hoveredCluster) return null;

  return (
    <OverlayViewF position={hoveredCluster.position} mapPaneName="floatPane">
      <div className="-translate-x-1/2 -translate-y-full -mt-7 whitespace-nowrap rounded-[6px] bg-white px-2.5 py-1.25 shadow-[0_2px_6px_rgba(0,0,0,0.2)] pointer-events-none">
        <span className="text-[0.82rem] font-semibold text-midnight">
          {hoveredCluster.count} branches
        </span>
        <span className="ml-1 text-[0.73rem] text-[#94a3b8]">
          — click to explore
        </span>
      </div>
    </OverlayViewF>
  );
}
