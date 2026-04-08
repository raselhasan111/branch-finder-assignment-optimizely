import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  current: number,
  total: number,
): (number | 'ellipsis')[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) return [1, 2, 3, 4, 'ellipsis', total];
  if (current >= total - 2)
    return [1, 'ellipsis', total - 3, total - 2, total - 1, total];

  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-brand transition-colors duration-300 hover:text-midnight disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex gap-2">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-10 w-10 items-center justify-center text-[0.95rem] text-slate-brand"
            >
              &hellip;
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[0.95rem] font-semibold transition-all duration-300"
              style={{
                background: page === currentPage ? '#d4af37' : '#f8f6f1',
                color: page === currentPage ? '#0a1628' : '#64748b',
                boxShadow:
                  page === currentPage
                    ? '0 10px 40px rgba(212, 175, 55, 0.3)'
                    : 'none',
              }}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-brand transition-colors duration-300 hover:text-midnight disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
