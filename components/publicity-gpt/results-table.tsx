"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  TrendingUp,
  Calendar,
  Building,
  MoreHorizontal,
  Eye,
  BookmarkPlus,
  Share2,
  Download,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Filter,
  Upload,
  FileDown,
  Search,
} from "lucide-react";
import { getMediaIcon, getOutletIcon } from "./media-icons";
import { formatDistanceToNow, format } from "date-fns";

interface ResultsTableProps {
  results: MediaResult[];
  loading?: boolean;
  onPaginationChange?: (pagination: {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalResults: number;
    handlePageChange: (page: number) => void;
  }) => void;
}

const ITEMS_PER_PAGE = 10;

export function ResultsTable({
  results,
  loading,
  onPaginationChange,
}: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: "",
    outlet: "all",
    topic: "all",
  });

  // Get unique values for filter options
  const outlets = Array.from(new Set(results.map((r) => r.outlet)));
  const topics = Array.from(new Set(results.map((r) => r.topic)));

  // Filter results based on current filters
  const filteredResults = results.filter((result) => {
    const matchesSearch =
      !filters.search ||
      result.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      result.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
      result.author.toLowerCase().includes(filters.search.toLowerCase());

    const matchesOutlet =
      filters.outlet === "all" || result.outlet === filters.outlet;
    const matchesTopic =
      filters.topic === "all" || result.topic === filters.topic;

    return matchesSearch && matchesOutlet && matchesTopic;
  });

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const getSentimentColor = (sentiment: MediaResult["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSentimentIcon = (sentiment: MediaResult["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-3 w-3" />;
      case "negative":
        return <ThumbsDown className="h-3 w-3" />;
      case "neutral":
        return <Minus className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const formatImpressions = (impressions: number) => {
    if (impressions >= 1000000) {
      return `${(impressions / 1000000).toFixed(1)}M`;
    } else if (impressions >= 1000) {
      return `${(impressions / 1000).toFixed(1)}K`;
    }
    return impressions.toString();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(currentResults.map((r) => r.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(Array.from(selectedItems));
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleUpload = () => {
    console.log("Uploading selected items:", Array.from(selectedItems));
    // In a real app, this would trigger file upload
  };

  const handleExport = () => {
    console.log("Exporting selected items:", Array.from(selectedItems));
    // In a real app, this would trigger CSV/Excel export
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      outlet: "all",
      topic: "all",
    });
  };

  const handleSaveArticle = (result: MediaResult) => {
    console.log("Saving article:", result.id);
    // In a real app, this would save to backend
  };

  const handleShareArticle = (result: MediaResult) => {
    console.log("Sharing article:", result.id);
    // In a real app, this would open share dialog
  };

  const handleDownloadArticle = (result: MediaResult) => {
    console.log("Downloading article:", result.id);
    // In a real app, this would download article content
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset to page 1 when results or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [results, filters]);

  // Notify parent about pagination state
  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        totalResults: filteredResults.length,
        handlePageChange,
      });
    }
  }, [
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    filteredResults.length,
    onPaginationChange,
  ]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {results.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline">💡 Try "positive news"</Badge>
            <Badge variant="outline">📅 Expand date range</Badge>
            <Badge variant="outline">🔍 Use broader keywords</Badge>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4" />
              <h3 className="font-medium">Filters</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <Input
                  placeholder="Search articles..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="h-9"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Outlet</label>
                <Select
                  value={filters.outlet}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, outlet: value }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All outlets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All outlets</SelectItem>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet} value={outlet}>
                        {outlet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Topic</label>
                <Select
                  value={filters.topic}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, topic: value }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All topics</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Selection Actions */}
          {selectedItems.size > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-900">
                {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-auto max-h-[500px]">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={
                          currentResults.length > 0 &&
                          selectedItems.size === currentResults.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[100px]">Month</TableHead>
                    <TableHead className="w-[120px]">Outlet</TableHead>
                    <TableHead className="w-[100px]">Impressions</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[120px]">Topic</TableHead>
                    <TableHead className="w-[100px]">Author</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResults.map((result) => (
                    <TableRow
                      key={result.id}
                      className="hover:bg-gray-50/50 group"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(result.id)}
                          onCheckedChange={(checked) =>
                            handleSelectItem(result.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {result.month}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {getMediaIcon(result.mediaType, result.outlet)}
                          </div>
                          <div>
                            <div className="font-medium text-sm flex items-center gap-1">
                              {getOutletIcon(result.outlet)}
                              {result.outlet}
                            </div>
                            <div className="text-xs text-gray-500">
                              {result.mediaType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {formatImpressions(result.impressions)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>
                              {format(result.publishedAt, "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(result.publishedAt, {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-xs">
                          {result.topic}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-900">
                          {result.author}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-50"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleSaveArticle(result)}
                              >
                                <BookmarkPlus className="h-4 w-4 mr-2" />
                                Save Article
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleShareArticle(result)}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadArticle(result)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Original
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
