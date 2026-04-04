import { AlertTriangle, RefreshCw } from 'lucide-react';

interface BranchErrorProps {
  error: Error;
  onRetry: () => void;
}

export default function BranchError({ error, onRetry }: BranchErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="mb-6 h-12 w-12 text-gold" />
      <h3
        className="mb-3 text-[1.5rem] font-semibold text-midnight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Unable to Load Branches
      </h3>
      <p
        className="mb-8 max-w-md text-[1rem] font-light text-slate-brand"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {error.message ||
          'Something went wrong while fetching branch data. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="flex cursor-pointer items-center gap-2 rounded-[50px] bg-gold px-8 py-3 text-[1rem] font-medium text-midnight transition-all duration-300 hover:-translate-y-[2px] hover:bg-midnight hover:text-warm-white"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
