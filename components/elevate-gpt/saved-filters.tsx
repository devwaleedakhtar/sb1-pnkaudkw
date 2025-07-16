"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Play,
  Trash2,
  Search,
  Calendar,
  Users,
  Hash,
  TrendingUp,
  Database,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  CheckCircle,
} from "lucide-react";
import { SavedInfluencerFilter } from "@/lib/types";

interface SavedFiltersProps {
  savedFilters: SavedInfluencerFilter[];
  onRunFilter: (filter: SavedInfluencerFilter) => void;
  onDeleteFilter: (id: string) => void;
}

export function SavedFilters({
  savedFilters,
  onRunFilter,
  onDeleteFilter,
}: SavedFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterToDelete, setFilterToDelete] = useState<string | null>(null);

  const filteredFilters = savedFilters.filter(
    (filter) =>
      filter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filter.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setFilterToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (filterToDelete) {
      onDeleteFilter(filterToDelete);
      setFilterToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-3 w-3 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-3 w-3 text-red-500" />;
      case "twitter":
        return <Twitter className="h-3 w-3 text-blue-500" />;
      case "tiktok":
        return <div className="h-3 w-3 bg-black rounded-full" />;
      default:
        return <Globe className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const getFilterSummary = (filter: SavedInfluencerFilter) => {
    const parts: string[] = [];

    if (filter.filters.platform !== "all") {
      parts.push(filter.filters.platform);
    }

    if (filter.filters.category !== "all") {
      parts.push(filter.filters.category);
    }

    if (
      filter.filters.minFollowers > 1000 ||
      filter.filters.maxFollowers < 10000000
    ) {
      parts.push(
        `${formatFollowerCount(
          filter.filters.minFollowers
        )}-${formatFollowerCount(filter.filters.maxFollowers)}`
      );
    }

    if (filter.filters.minEngagement > 1) {
      parts.push(`${filter.filters.minEngagement}%+ engagement`);
    }

    if (filter.filters.verified) {
      parts.push("verified");
    }

    return parts.join(" • ");
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Saved Filters
          {savedFilters.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {savedFilters.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search saved filters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredFilters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bookmark className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">
                  {savedFilters.length === 0
                    ? "No saved filters yet"
                    : "No filters match your search"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {savedFilters.length === 0
                    ? "Create filters in the AI chat to save them"
                    : "Try a different search term"}
                </p>
              </div>
            ) : (
              filteredFilters.map((filter) => (
                <Card
                  key={filter.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{filter.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {filter.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          onClick={() => onRunFilter(filter)}
                          size="sm"
                          className="h-7 px-2"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(filter.id)}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Query */}
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <span className="text-gray-600">Query: </span>
                      <span className="font-mono">{filter.query}</span>
                    </div>

                    {/* Filter Details */}
                    <div className="flex flex-wrap gap-1">
                      {filter.filters.platform !== "all" && (
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          {getPlatformIcon(filter.filters.platform)}
                          <span className="ml-1 capitalize">
                            {filter.filters.platform}
                          </span>
                        </Badge>
                      )}

                      {filter.filters.category !== "all" && (
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          <Hash className="h-3 w-3 mr-1" />
                          <span className="capitalize">
                            {filter.filters.category}
                          </span>
                        </Badge>
                      )}

                      {(filter.filters.minFollowers > 1000 ||
                        filter.filters.maxFollowers < 10000000) && (
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          <Users className="h-3 w-3 mr-1" />
                          {formatFollowerCount(filter.filters.minFollowers)}-
                          {formatFollowerCount(filter.filters.maxFollowers)}
                        </Badge>
                      )}

                      {filter.filters.minEngagement > 1 && (
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {filter.filters.minEngagement}%+
                        </Badge>
                      )}

                      {filter.filters.verified && (
                        <Badge variant="outline" className="text-xs h-5 px-2">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}

                      <Badge variant="outline" className="text-xs h-5 px-2">
                        {filter.filters.useInternalDb ? (
                          <Database className="h-3 w-3 mr-1" />
                        ) : (
                          <Globe className="h-3 w-3 mr-1" />
                        )}
                        {filter.filters.useInternalDb ? "Internal" : "Broad"}
                      </Badge>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {filter.createdAt.toLocaleDateString()}
                      </div>
                      {filter.resultCount && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {filter.resultCount} results
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Filter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved filter? This action
              cannot be undone.
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
    </Card>
  );
}
