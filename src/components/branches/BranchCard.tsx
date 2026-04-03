import { Navigation, ArrowRight } from 'lucide-react';
import type { Branch } from '@/data/branches';

interface BranchCardProps {
  branch: Branch;
}

export default function BranchCard({ branch }: BranchCardProps) {
  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[25px] bg-cream transition-all duration-500"
      style={{
        boxShadow: '0 10px 30px rgba(10, 22, 40, 0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
        e.currentTarget.style.boxShadow = '0 30px 60px rgba(10, 22, 40, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(10, 22, 40, 0.05)';
      }}
    >
      {/* Gold accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, #d4af37, #8b9d83)' }}
      />

      {/* Image placeholder */}
      <div
        className="relative h-[180px] w-full"
        style={{ background: 'linear-gradient(135deg, #1a2942, #0d4d56)' }}
      >
        {/* Status badge */}
        <div
          className="absolute left-6 top-5 rounded-[20px] px-[1.2rem] py-[0.5rem] text-[0.85rem] font-semibold uppercase"
          style={{
            fontFamily: "'Jost', sans-serif",
            background: branch.isOpen ? '#d4af37' : '#64748b',
            color: '#0a1628',
          }}
        >
          {branch.isOpen ? 'Open Now' : 'Closed'}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-[2.5rem]">
        {/* Name + Distance */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3
            className="text-[1.3rem] font-semibold leading-tight text-midnight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {branch.name}
          </h3>
          <span className="flex flex-shrink-0 items-center gap-1 text-[0.9rem] font-medium text-slate-brand">
            <Navigation className="h-3.5 w-3.5" />
            {branch.distance}
          </span>
        </div>

        {/* Address */}
        <p
          className="mb-4 text-[0.95rem] font-light leading-relaxed text-slate-brand"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          {branch.address}
          <br />
          {branch.city}, {branch.state} {branch.zip}
        </p>

        {/* Hours */}
        <p
          className="mb-4 text-[0.9rem] font-normal text-slate-brand"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          {branch.hours}
        </p>

        {/* Service tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {branch.services.map((service) => (
            <span
              key={service}
              className="rounded-[25px] bg-warm-white px-3 py-1 text-[0.8rem] font-medium uppercase tracking-[0.5px] text-midnight"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              {service}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-[50px] bg-gold px-[2.5rem] py-[1rem] text-[1rem] font-medium text-midnight transition-all duration-400 hover:-translate-y-[3px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)',
            }}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
