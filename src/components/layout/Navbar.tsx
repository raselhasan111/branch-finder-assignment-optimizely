import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Personal', href: '#' },
  { label: 'Business', href: '#' },
  { label: 'Wealth', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Articles', href: '#' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="animate-slide-down fixed top-0 z-50 w-full">
      <nav className="flex items-center justify-between px-[5%] py-6">
        {/* Logo */}
        <Link
          to="/branches"
          className="font-heading text-[1.8rem] font-bold leading-[1.6] tracking-[-0.5px] text-warm-white no-underline"
        >
          Brightstream
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden list-none items-center gap-12 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="nav-link relative text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline transition-all duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="rounded-[30px] bg-gold px-[1.8rem] py-[0.7rem] text-[0.95rem] font-normal text-cream no-underline transition-all duration-300 hover:-translate-y-[2px] hover:bg-warm-white hover:text-midnight hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
            >
              Get Started
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center text-warm-white lg:hidden"
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
          className="flex flex-col items-center gap-6 pb-8 pt-4 lg:hidden"
          style={{ background: 'rgba(10, 22, 40, 0.95)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.95rem] font-normal tracking-[0.5px] text-cream no-underline"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            className="rounded-[30px] bg-gold px-[1.8rem] py-[0.7rem] text-[1rem] font-medium text-midnight no-underline"
          >
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
