"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaResult } from "@/lib/types";
import { ResultsTable } from "./results-table";
import { ResultsGrid } from "./results-grid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ResultsDisplayProps {
  results: MediaResult[];
  loading?: boolean;
  viewMode: "table" | "grid";
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalResults: number;
  handlePageChange: (page: number) => void;
}

export function ResultsDisplay({
  results,
  loading,
  viewMode,
}: ResultsDisplayProps) {
  const [paginationData, setPaginationData] = useState<PaginationData | null>(
    null
  );

  const handlePaginationChange = useCallback((pagination: PaginationData) => {
    setPaginationData(pagination);
  }, []);

  // Reset pagination when viewMode changes
  useEffect(() => {
    setPaginationData(null);
  }, [viewMode]);

  return (
    <div>
      {viewMode === "table" ? (
        <ResultsTable
          results={results}
          loading={loading}
          onPaginationChange={handlePaginationChange}
        />
      ) : (
        <ResultsGrid
          results={results}
          loading={loading}
          onPaginationChange={handlePaginationChange}
        />
      )}

      {/* Pagination Controls - Outside the table/grid container */}
      {paginationData &&
        paginationData.totalResults > 0 &&
        !loading &&
        paginationData.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-6 pb-4">
            <div className="text-sm text-gray-600">
              Showing {paginationData.startIndex + 1} to{" "}
              {Math.min(paginationData.endIndex, paginationData.totalResults)}{" "}
              of {paginationData.totalResults} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  paginationData.handlePageChange(
                    paginationData.currentPage - 1
                  )
                }
                disabled={paginationData.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: paginationData.totalPages },
                  (_, i) => i + 1
                ).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === paginationData.totalPages ||
                    (page >= paginationData.currentPage - 1 &&
                      page <= paginationData.currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === 2 && paginationData.currentPage > 4) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    if (
                      page === paginationData.totalPages - 1 &&
                      paginationData.currentPage < paginationData.totalPages - 3
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={
                        page === paginationData.currentPage
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => paginationData.handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  paginationData.handlePageChange(
                    paginationData.currentPage + 1
                  )
                }
                disabled={
                  paginationData.currentPage === paginationData.totalPages
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
