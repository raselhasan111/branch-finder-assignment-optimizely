import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-midnight px-[5%] py-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              <span
                className="text-[1.8rem] font-bold text-warm-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Brightstream
              </span>
            </div>
            <p className="max-w-[300px] text-[0.95rem] font-light leading-relaxed text-slate-brand">
              Banking Reimagined. Premium financial services with a personal
              touch.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
              Quick Links
            </h4>
            <ul className="flex list-none flex-col gap-3 p-0">
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  Find a Branch
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
              Support
            </h4>
            <ul className="flex list-none flex-col gap-3 p-0">
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
              Legal
            </h4>
            <ul className="flex list-none flex-col gap-3 p-0">
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[0.95rem] font-light text-cream no-underline transition-colors duration-300 hover:text-gold"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-navy pt-8 text-center">
          <p className="text-[0.9rem] font-light text-slate-brand">
            &copy; {new Date().getFullYear()} Brightstream Bank. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
