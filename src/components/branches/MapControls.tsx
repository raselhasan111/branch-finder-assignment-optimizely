import { LocateFixed, Maximize, Minimize, Plus, Minus } from 'lucide-react';

interface MapControlsProps {
  map: google.maps.Map | null;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  userLocation: { latitude: number; longitude: number } | null;
  onMyLocation: () => void;
}

export default function MapControls({
  map,
  isFullscreen,
  toggleFullscreen,
  userLocation,
  onMyLocation,
}: MapControlsProps) {
  return (
    <div className="absolute bottom-14 right-4 z-1000 flex flex-col gap-2 sm:bottom-5">
      {userLocation && (
        <button
          onClick={onMyLocation}
          title="Go to my location"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border-0 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-colors hover:bg-gray-100"
        >
          <LocateFixed className="h-5 w-5 text-[#666]" />
        </button>
      )}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border-0 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-colors hover:bg-gray-100"
      >
        {isFullscreen ? (
          <Minimize className="h-5 w-5 text-[#666]" />
        ) : (
          <Maximize className="h-5 w-5 text-[#666]" />
        )}
      </button>
      <div className="flex flex-col overflow-hidden rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
        <button
          onClick={() => map?.setZoom((map.getZoom() ?? 2) + 1)}
          title="Zoom in"
          className="flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-white transition-colors hover:bg-gray-100"
        >
          <Plus className="h-4.5 w-4.5 text-[#666]" />
        </button>
        <div className="h-px bg-[#e6e6e6]" />
        <button
          onClick={() => map?.setZoom((map.getZoom() ?? 2) - 1)}
          title="Zoom out"
          className="flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-white transition-colors hover:bg-gray-100"
        >
          <Minus className="h-4.5 w-4.5 text-[#666]" />
        </button>
      </div>
    </div>
  );
}
