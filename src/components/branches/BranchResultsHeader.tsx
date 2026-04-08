interface BranchResultsHeaderProps {
  isLoading: boolean;
  totalResults: number;
  hasSearchQuery: boolean;
  queryText: string;
}

export default function BranchResultsHeader({
  isLoading,
  totalResults,
  hasSearchQuery,
  queryText,
}: BranchResultsHeaderProps) {
  return (
    <div className="flex flex-col xl:max-w-150">
      <span className="mb-3 text-[0.9rem] font-medium uppercase tracking-[3px] text-sage">
        Branch Results
      </span>
      <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.2] tracking-[-1px] text-midnight">
        {isLoading
          ? 'Searching...'
          : `${totalResults} Branch${totalResults !== 1 ? 'es' : ''} Found`}
      </h2>
      {hasSearchQuery && queryText && (
        <p className="mt-2 text-[1rem] font-light tracking-wider text-slate-brand">
          Showing results for &ldquo;{queryText}&rdquo;
        </p>
      )}
    </div>
  );
}
