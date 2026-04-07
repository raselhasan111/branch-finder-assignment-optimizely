import { useRouter } from '@tanstack/react-router';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="mb-6 h-12 w-12 text-gold" />
      <p
        className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        Error
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
        Something Went Wrong
      </h1>
      <p
        className="mb-10 max-w-md text-[1rem] font-light text-slate-brand"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={() => router.invalidate()}
        className="flex cursor-pointer items-center gap-2 rounded-[50px] bg-gold px-8 py-3 text-[1rem] font-medium text-midnight transition-all duration-300 hover:-translate-y-[2px] hover:bg-midnight hover:text-warm-white"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
