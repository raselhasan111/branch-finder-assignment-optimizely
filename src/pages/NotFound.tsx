import { Link } from '@tanstack/react-router';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p
        className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        404
      </p>
      <h1
        className="mb-4 text-midnight"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '-1px',
          lineHeight: 1.2,
        }}
      >
        Page Not Found
      </h1>
      <p
        className="mb-10 max-w-md text-[1rem] font-light text-slate-brand"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="rounded-[25px] bg-midnight px-8 py-3 text-[0.9rem] font-medium text-warm-white transition-all duration-300 hover:bg-navy"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        Back to Home
      </Link>
    </div>
  );
}
