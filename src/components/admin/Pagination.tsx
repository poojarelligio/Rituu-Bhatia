"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Compact pagination: always shows page 1, the last page, and a small
 * window around the current page, collapsing everything else into "…" —
 * so it stays usable even with 50+ pages instead of listing every number.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm border border-line rounded-sm text-charcoal/60 hover:border-burgundy hover:text-burgundy disabled:opacity-40 disabled:hover:border-line disabled:hover:text-charcoal/60 transition-colors"
      >
        ‹ Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-charcoal/30 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded-sm transition-colors ${
                p === currentPage ? "bg-burgundy text-ivory" : "text-charcoal/60 hover:bg-ivory-deep"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm border border-line rounded-sm text-charcoal/60 hover:border-burgundy hover:text-burgundy disabled:opacity-40 disabled:hover:border-line disabled:hover:text-charcoal/60 transition-colors"
      >
        Next ›
      </button>
    </div>
  );
}