"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Filter,
  X,
  Calendar,
  FileText,
  Heart,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface FilterSidebarProps {
  onFiltersChange: (filters: MediaFilters) => void;
  onClearFilters: () => void;
}

export interface MediaFilters {
  dateRange: {
    start: string;
    end: string;
  };
  mediaTypes: string[];
  sentiment: string[];
  outlets: string[];
  minReach: number;
}

export function FilterSidebar({
  onFiltersChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<MediaFilters>({
    dateRange: { start: "", end: "" },
    mediaTypes: [],
    sentiment: [],
    outlets: [],
    minReach: 0,
  });

  const [openSections, setOpenSections] = useState({
    dateRange: true,
    mediaTypes: true,
    sentiment: true,
    outlets: false,
    reach: false,
  });

  const mediaTypes = [
    { id: "Online News", label: "Online News", icon: FileText },
    { id: "Print Media", label: "Print Media", icon: FileText },
    { id: "Broadcast", label: "Broadcast", icon: FileText },
    { id: "Podcast", label: "Podcast", icon: FileText },
    { id: "Blog", label: "Blog", icon: FileText },
    { id: "Social Media", label: "Social Media", icon: FileText },
  ];

  const sentimentOptions = [
    {
      id: "positive",
      label: "Positive",
      color: "bg-green-100 text-green-800",
      icon: "😊",
    },
    {
      id: "neutral",
      label: "Neutral",
      color: "bg-gray-100 text-gray-800",
      icon: "😐",
    },
    {
      id: "negative",
      label: "Negative",
      color: "bg-red-100 text-red-800",
      icon: "😞",
    },
  ];

  const popularOutlets = [
    "TechCrunch",
    "Wired",
    "CNN Business",
    "Forbes",
    "Reuters",
    "Associated Press",
  ];

  const reachPresets = [
    { label: "Any", value: 0 },
    { label: "1K+", value: 1000 },
    { label: "10K+", value: 10000 },
    { label: "100K+", value: 100000 },
    { label: "1M+", value: 1000000 },
  ];

  const updateFilters = (key: keyof MediaFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (
    key: "mediaTypes" | "sentiment" | "outlets",
    value: string
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilters(key, newArray);
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearFilters = () => {
    const clearedFilters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.mediaTypes.length > 0) count++;
    if (filters.sentiment.length > 0) count++;
    if (filters.outlets.length > 0) count++;
    if (filters.minReach > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card className="w-72 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 bg-pink-100 text-pink-800"
              >
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={activeFilterCount === 0}
            className="h-8 px-2"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Date Range */}
        <Collapsible
          open={openSections.dateRange}
          onOpenChange={() => toggleSection("dateRange")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Date Range</span>
            </div>
            {openSections.dateRange ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-2 space-y-2">
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) =>
                updateFilters("dateRange", {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
              className="h-8 text-sm"
            />
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) =>
                updateFilters("dateRange", {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
              className="h-8 text-sm"
            />
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Media Types */}
        <Collapsible
          open={openSections.mediaTypes}
          onOpenChange={() => toggleSection("mediaTypes")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Media Type</span>
              {filters.mediaTypes.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-blue-100 text-blue-800 text-xs"
                >
                  {filters.mediaTypes.length}
                </Badge>
              )}
            </div>
            {openSections.mediaTypes ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-2 space-y-2">
            {mediaTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={filters.mediaTypes.includes(type.id)}
                  onCheckedChange={() =>
                    toggleArrayFilter("mediaTypes", type.id)
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor={type.id} className="text-sm cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Sentiment */}
        <Collapsible
          open={openSections.sentiment}
          onOpenChange={() => toggleSection("sentiment")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sentiment</span>
              {filters.sentiment.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-purple-100 text-purple-800 text-xs"
                >
                  {filters.sentiment.length}
                </Badge>
              )}
            </div>
            {openSections.sentiment ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-2 space-y-2">
            {sentimentOptions.map((sentiment) => (
              <div key={sentiment.id} className="flex items-center space-x-2">
                <Checkbox
                  id={sentiment.id}
                  checked={filters.sentiment.includes(sentiment.id)}
                  onCheckedChange={() =>
                    toggleArrayFilter("sentiment", sentiment.id)
                  }
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={sentiment.id}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <span>{sentiment.icon}</span>
                  {sentiment.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Outlets */}
        <Collapsible
          open={openSections.outlets}
          onOpenChange={() => toggleSection("outlets")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Outlets</span>
              {filters.outlets.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-green-100 text-green-800 text-xs"
                >
                  {filters.outlets.length}
                </Badge>
              )}
            </div>
            {openSections.outlets ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-2 space-y-2">
            {popularOutlets.map((outlet) => (
              <div key={outlet} className="flex items-center space-x-2">
                <Checkbox
                  id={outlet}
                  checked={filters.outlets.includes(outlet)}
                  onCheckedChange={() => toggleArrayFilter("outlets", outlet)}
                  className="h-4 w-4"
                />
                <Label htmlFor={outlet} className="text-sm cursor-pointer">
                  {outlet}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Minimum Reach */}
        <Collapsible
          open={openSections.reach}
          onOpenChange={() => toggleSection("reach")}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Min. Reach</span>
              {filters.minReach > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-orange-100 text-orange-800 text-xs"
                >
                  {filters.minReach >= 1000000
                    ? `${(filters.minReach / 1000000).toFixed(1)}M`
                    : filters.minReach >= 1000
                    ? `${(filters.minReach / 1000).toFixed(1)}K`
                    : filters.minReach}
                </Badge>
              )}
            </div>
            {openSections.reach ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-2 space-y-3">
            <div className="flex flex-wrap gap-1">
              {reachPresets.map((preset) => (
                <Button
                  key={preset.value}
                  variant={
                    filters.minReach === preset.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => updateFilters("minReach", preset.value)}
                  className="h-7 px-2 text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={filters.minReach || ""}
              onChange={(e) =>
                updateFilters("minReach", parseInt(e.target.value) || 0)
              }
              placeholder="Custom value"
              className="h-8 text-sm"
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
