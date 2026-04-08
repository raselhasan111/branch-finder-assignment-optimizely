import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Navigation,
  Star,
} from 'lucide-react';
import type { Branch } from '@/types/branch';
import { useLocation } from '@/contexts/LocationContext';
import {
  calculateDistance,
  formatDistance,
  parseCoordinates,
} from '@/lib/utils';

interface BranchCardProps {
  branch: Branch;
  isClosest?: boolean;
}

export default function BranchCard({ branch, isClosest }: BranchCardProps) {
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
    <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[25px] bg-cream shadow-none transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_30px_60px_rgba(10,22,40,0.15)]">
      {/* Image placeholder */}
      <div className="relative h-45 w-full bg-linear-to-br from-navy to-deep-teal">
        {/* Top-left badges: distance + closest */}
        <div className="absolute left-6 top-6 flex flex-wrap items-center gap-2">
          {distance != null ? (
            <div className="flex items-center gap-1.5 rounded-[20px] bg-gold px-[1.2rem] py-2 text-[0.85rem] font-semibold text-midnight uppercase">
              <Navigation className="h-3.5 w-3.5" />
              {formatDistance(distance)}
            </div>
          ) : (
            branch.CountryCode && (
              <div className="rounded-[20px] bg-gold px-[1.2rem] py-2 text-[0.85rem] font-semibold text-midnight uppercase">
                {branch.CountryCode}
              </div>
            )
          )}
          {isClosest && (
            <div className="flex items-center gap-1.5 rounded-[20px] bg-warm-white px-[1.2rem] py-2 text-[0.85rem] font-semibold text-midnight">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              Closest to you
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-10">
        {/* Name */}
        <h3 className="mb-4 text-[1.8rem] font-semibold leading-tight text-midnight">
          {branch.Name ?? 'Unknown Branch'}
        </h3>

        {/* Address */}
        <div className="mb-6 flex items-start gap-2 text-slate-brand">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p className="text-[1rem] font-light leading-relaxed">
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
          <div className="mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-gold" />
            <a
              href={`tel:${branch.Phone}`}
              className="text-[0.95rem] font-light text-slate-brand transition-colors duration-200 hover:text-midnight"
            >
              {branch.Phone}
            </a>
          </div>
        )}
        {branch.Email && (
          <div className="mb-6 flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-gold" />
            <a
              href={`mailto:${branch.Email}`}
              className="text-[0.95rem] font-light text-slate-brand transition-colors duration-200 hover:text-midnight"
            >
              {branch.Email}
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto flex flex-col gap-3 pt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <button className="group/cta flex cursor-pointer items-center gap-1 text-[0.95rem] font-medium text-gold transition-colors duration-300 hover:text-midnight">
            Read More
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </button>

          {branchLat != null && branchLon != null && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${branchLat},${branchLon}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group/dir flex min-h-11 items-center justify-center gap-1.5 rounded-[20px] border border-gold/30 px-4 py-2 text-[0.85rem] font-semibold text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-midnight lg:min-h-0 lg:py-1.5"
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
