import { Link } from '@tanstack/react-router';
import { MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 z-50 w-full"
      style={{
        background: 'rgba(10, 22, 40, 0.85)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-[5%]">
        {/* Logo */}
        <Link
          to="/branches"
          className="flex items-center gap-2 text-warm-white no-underline"
        >
          <MapPin className="h-5 w-5 text-gold" />
          <span
            className="text-[1.8rem] font-bold leading-none text-warm-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Brightstream
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-12 md:flex">
          <Link
            to="/branches"
            className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline transition-colors duration-300 hover:text-gold"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Locations
          </Link>
          <a
            href="#"
            className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline transition-colors duration-300 hover:text-gold"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Services
          </a>
          <a
            href="#"
            className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline transition-colors duration-300 hover:text-gold"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Support
          </a>
          <a
            href="#"
            className="rounded-[30px] bg-gold px-7 py-[0.7rem] text-[1rem] font-medium tracking-[0.5px] text-midnight no-underline transition-all duration-400 hover:-translate-y-[2px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)',
            }}
          >
            Contact Us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center text-warm-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="flex flex-col items-center gap-6 pb-8 pt-4 md:hidden"
          style={{ background: 'rgba(10, 22, 40, 0.95)' }}
        >
          <Link
            to="/branches"
            className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline"
            onClick={() => setMobileOpen(false)}
          >
            Locations
          </Link>
          <a
            href="#"
            className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline"
          >
            Services
          </a>
          <a
            href="#"
            className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline"
          >
            Support
          </a>
          <a
            href="#"
            className="rounded-[30px] bg-gold px-7 py-[0.7rem] text-[1rem] font-medium text-midnight no-underline"
          >
            Contact Us
          </a>
        </div>
      )}
    </header>
  );
}
