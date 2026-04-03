import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-brand transition-colors duration-300 hover:text-midnight disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[0.95rem] font-semibold transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
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
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-brand transition-colors duration-300 hover:text-midnight disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
