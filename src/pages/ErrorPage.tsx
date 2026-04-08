import { useRouter } from '@tanstack/react-router';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <AlertTriangle className="mb-6 h-12 w-12 text-gold" />
      <p className="mb-4 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
        Error
      </p>
      <h1 className="mb-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.2] tracking-[-1px] text-midnight">
        Something Went Wrong
      </h1>
      <p className="mb-10 max-w-md text-[1rem] font-light text-slate-brand">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={() => router.invalidate()}
        className="flex cursor-pointer items-center gap-2 rounded-[50px] bg-gold px-8 py-3 text-[1rem] font-medium text-midnight transition-all duration-300 hover:-translate-y-0.5 hover:bg-midnight hover:text-warm-white"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
