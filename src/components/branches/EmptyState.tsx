interface EmptyStateProps {
  hasClientFilters: boolean;
  onClearAll: () => void;
}

export default function EmptyState({
  hasClientFilters,
  onClearAll,
}: EmptyStateProps) {
  return (
    <div className="py-20 text-center">
      <p className="text-[1.15rem] font-light text-slate-brand">
        {hasClientFilters
          ? 'No branches match your current filters. Try adjusting your selection.'
          : 'No branches found. Try a different search term.'}
      </p>
      {hasClientFilters && (
        <button
          onClick={onClearAll}
          className="mt-4 text-[0.95rem] cursor-pointer font-medium text-gold underline transition-colors hover:text-midnight"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
