import { MapPin, Phone, Mail, ArrowRight, Navigation } from 'lucide-react';
import type { Branch } from '@/types/branch';
import { parseCoordinates } from '@/types/branch';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/lib/utils';

interface BranchCardProps {
  branch: Branch;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const { location } = useLocation();
  const [branchLat, branchLon] = parseCoordinates(branch.Coordinates);

  const distance =
    location && branchLat != null && branchLon != null
      ? calculateDistance(
          location.latitude,
          location.longitude,
          branchLat,
          branchLon,
        )
      : null;
  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[25px] bg-cream transition-all duration-500"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 30px 60px rgba(10, 22, 40, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image placeholder */}
      <div
        className="relative h-[180px] w-full"
        style={{ background: 'linear-gradient(135deg, #1a2942, #0d4d56)' }}
      >
        {/* Top-left badge: distance when available, country as fallback */}
        <div className="absolute left-6 top-6">
          {distance != null ? (
            <div
              className="flex items-center gap-1.5 rounded-[20px] px-[1.2rem] py-2 text-[0.85rem] font-semibold uppercase"
              style={{
                fontFamily: "'Jost', sans-serif",
                background: '#d4af37',
                color: '#0a1628',
              }}
            >
              <Navigation className="h-3.5 w-3.5" />
              {formatDistance(distance)}
            </div>
          ) : (
            branch.CountryCode && (
              <div
                className="rounded-[20px] px-[1.2rem] py-2 text-[0.85rem] font-semibold uppercase"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  background: '#d4af37',
                  color: '#0a1628',
                }}
              >
                {branch.CountryCode}
              </div>
            )
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-10">
        {/* Name */}
        <h3
          className="mb-4 text-[1.8rem] font-semibold leading-tight text-midnight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {branch.Name ?? 'Unknown Branch'}
        </h3>

        {/* Address */}
        <div className="mb-6 flex items-start gap-2 text-slate-brand">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p
            className="text-[1rem] font-light leading-relaxed"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            {branch.Street && (
              <>
                {branch.Street}
                <br />
              </>
            )}
            {[branch.City, branch.Country, branch.ZipCode]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>

        {/* Contact details */}
        {branch.Phone && (
          <div className="mb-3 flex items-center gap-2 text-slate-brand">
            <Phone className="h-4 w-4 shrink-0 text-gold" />
            <span
              className="text-[0.95rem] font-light"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {branch.Phone}
            </span>
          </div>
        )}
        {branch.Email && (
          <div className="mb-6 flex items-center gap-2 text-slate-brand">
            <Mail className="h-4 w-4 shrink-0 text-gold" />
            <span
              className="text-[0.95rem] font-light"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {branch.Email}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <button
            className="group/cta flex cursor-pointer items-center gap-1 text-[0.95rem] font-medium text-gold transition-colors duration-300 hover:text-midnight"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Read More
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </button>

          {branchLat != null && branchLon != null && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${branchLat},${branchLon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/dir flex min-h-[44px] items-center justify-center gap-1.5 rounded-[20px] border border-gold/30 px-4 py-2 text-[0.85rem] font-semibold text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight sm:min-h-0 sm:py-1.5"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              <Navigation className="h-3.5 w-3.5" />
              Get Directions
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
