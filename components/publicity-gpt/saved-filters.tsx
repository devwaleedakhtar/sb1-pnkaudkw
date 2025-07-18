"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Bookmark,
  MoreHorizontal,
  Play,
  Trash2,
  Calendar,
  Hash,
  Building,
  TrendingUp,
  Clock,
  Search,
} from "lucide-react";
import { SavedFilter, MediaFilters } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  onRunFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (id: string) => void;
}

export function SavedFilters({
  savedFilters,
  onRunFilter,
  onDeleteFilter,
}: SavedFiltersProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterToDelete, setFilterToDelete] = useState<SavedFilter | null>(
    null
  );

  const handleDeleteClick = (filter: SavedFilter) => {
    setFilterToDelete(filter);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (filterToDelete) {
      onDeleteFilter(filterToDelete.id);
      setDeleteDialogOpen(false);
      setFilterToDelete(null);
    }
  };

  const getFilterSummary = (filters: MediaFilters) => {
    const summary: string[] = [];

    if (filters.dateRange.start) {
      const date = new Date(filters.dateRange.start);
      summary.push(`From ${date.toLocaleDateString()}`);
    }

    if (filters.mediaTypes.length > 0) {
      summary.push(
        `${filters.mediaTypes.length} media type${
          filters.mediaTypes.length > 1 ? "s" : ""
        }`
      );
    }

    if (filters.sentiment.length > 0) {
      summary.push(`${filters.sentiment.join(", ")} sentiment`);
    }

    if (filters.outlets.length > 0) {
      summary.push(
        `${filters.outlets.length} outlet${
          filters.outlets.length > 1 ? "s" : ""
        }`
      );
    }

    if (filters.minReach > 0) {
      summary.push(`Min reach: ${filters.minReach.toLocaleString()}`);
    }

    return summary.length > 0 ? summary.join(" • ") : "Default parameters";
  };

  const getSentimentColor = (sentiment: string[]) => {
    if (sentiment.includes("positive")) return "bg-green-100 text-green-800";
    if (sentiment.includes("negative")) return "bg-red-100 text-red-800";
    if (sentiment.includes("neutral")) return "bg-gray-100 text-gray-800";
    return "bg-blue-100 text-blue-800";
  };

  if (savedFilters.length === 0) {
    return (
      <Card className="max-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Searches
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No saved searches yet</p>
            <p className="text-sm">
              Use the AI chat to create searches and save them for quick access
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="max-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Searches
            <Badge variant="secondary" className="ml-auto">
              {savedFilters.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-6">
              {savedFilters.map((filter) => (
                <Card
                  key={filter.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1">
                          {filter.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          {filter.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(filter.createdAt, {
                            addSuffix: true,
                          })}
                          {filter.resultCount && (
                            <>
                              <span>•</span>
                              <Hash className="h-3 w-3" />
                              {filter.resultCount} results
                            </>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onRunFilter(filter)}>
                            <Play className="h-4 w-4 mr-2" />
                            Run Search
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(filter)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Search Summary */}
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">
                        {getFilterSummary(filter.filters)}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {filter.filters.mediaTypes.map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                        {filter.filters.sentiment.map((sentiment) => (
                          <Badge
                            key={sentiment}
                            variant="outline"
                            className={`text-xs ${getSentimentColor([
                              sentiment,
                            ])}`}
                          >
                            {sentiment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Search</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{filterToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
