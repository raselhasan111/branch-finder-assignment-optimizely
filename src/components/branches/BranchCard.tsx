import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import type { Branch } from '@/types/branch';

interface BranchCardProps {
  branch: Branch;
}

export default function BranchCard({ branch }: BranchCardProps) {
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
        {/* Country badge */}
        {branch.CountryCode && (
          <div
            className="absolute left-6 top-6 rounded-[20px] px-[1.2rem] py-2 text-[0.85rem] font-semibold uppercase"
            style={{
              fontFamily: "'Jost', sans-serif",
              background: '#d4af37',
              color: '#0a1628',
            }}
          >
            {branch.CountryCode}
          </div>
        )}
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
        <div className="mt-auto">
          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[50px] bg-gold px-[2rem] py-[1rem] text-[1rem] font-medium text-midnight transition-all duration-300 hover:-translate-y-[2px] hover:bg-midnight hover:text-warm-white"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
