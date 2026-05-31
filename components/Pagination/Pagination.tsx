import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (page > 3) pages.push("...");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (page < totalPages - 2) pages.push("...");

  pages.push(totalPages);
  return pages;
}

export default function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-56 bg-surface border-t border-outline z-10">
      <div className="flex items-center justify-center md:justify-between px-4 py-3">
        <span className="hidden md:block text-label-sm text-text-muted w-24">
          {total} total
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-body-sm text-text-muted hover:text-text hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Prev</span>
          </button>

          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-1 text-text-subtle text-body-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-body-sm transition-colors ${
                  p === page
                    ? "bg-primary text-white font-medium"
                    : "text-text-muted hover:text-text hover:bg-surface-high"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-body-sm text-text-muted hover:text-text hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="hidden md:block text-label-sm text-text-muted w-24 text-right">
          Page {page} of {totalPages}
        </span>
      </div>
    </div>
  );
}
