import { Link } from '@tanstack/react-router';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
        404
      </p>
      <h1 className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.2] tracking-[-1px] text-midnight">
        Page Not Found
      </h1>
      <p className="mb-10 max-w-md text-[1rem] font-light text-slate-brand">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="rounded-[25px] bg-midnight px-8 py-3 text-[0.9rem] font-medium text-warm-white transition-all duration-300 hover:bg-navy"
      >
        Back to Home
      </Link>
    </div>
  );
}
