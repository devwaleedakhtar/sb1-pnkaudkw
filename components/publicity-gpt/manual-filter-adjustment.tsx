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
  Settings,
  X,
  Calendar,
  FileText,
  Heart,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Save,
  Play,
} from "lucide-react";
import { MediaFilters } from "@/lib/types";

interface ManualFilterAdjustmentProps {
  filters: MediaFilters;
  onFiltersChange: (filters: MediaFilters) => void;
  onSave: () => void;
  onRunSearch: () => void;
  onClose: () => void;
}

export function ManualFilterAdjustment({
  filters,
  onFiltersChange,
  onSave,
  onRunSearch,
  onClose,
}: ManualFilterAdjustmentProps) {
  const [localFilters, setLocalFilters] = useState<MediaFilters>(filters);
  const [expandedSections, setExpandedSections] = useState({
    dateRange: true,
    mediaTypes: true,
    sentiment: false,
    outlets: false,
    reach: false,
  });

  const mediaTypes = [
    "Online News",
    "Print Media",
    "Broadcast",
    "Podcast",
    "Blog",
    "Social Media",
  ];

  const sentimentOptions = ["positive", "neutral", "negative"];

  const popularOutlets = [
    "TechCrunch",
    "Forbes",
    "Reuters",
    "Bloomberg",
    "Wired",
    "CNN Business",
    "The Verge",
    "Engadget",
  ];

  const handleFilterChange = (newFilters: MediaFilters) => {
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    const newFilters = {
      ...localFilters,
      dateRange: {
        ...localFilters.dateRange,
        [field]: value,
      },
    };
    handleFilterChange(newFilters);
  };

  const handleMediaTypeToggle = (mediaType: string) => {
    const newMediaTypes = localFilters.mediaTypes.includes(mediaType)
      ? localFilters.mediaTypes.filter((type) => type !== mediaType)
      : [...localFilters.mediaTypes, mediaType];

    handleFilterChange({
      ...localFilters,
      mediaTypes: newMediaTypes,
    });
  };

  const handleSentimentToggle = (sentiment: string) => {
    const newSentiment = localFilters.sentiment.includes(sentiment)
      ? localFilters.sentiment.filter((s) => s !== sentiment)
      : [...localFilters.sentiment, sentiment];

    handleFilterChange({
      ...localFilters,
      sentiment: newSentiment,
    });
  };

  const handleOutletToggle = (outlet: string) => {
    const newOutlets = localFilters.outlets.includes(outlet)
      ? localFilters.outlets.filter((o) => o !== outlet)
      : [...localFilters.outlets, outlet];

    handleFilterChange({
      ...localFilters,
      outlets: newOutlets,
    });
  };

  const handleMinReachChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    handleFilterChange({
      ...localFilters,
      minReach: numValue,
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };
    handleFilterChange(clearedFilters);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="max-h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Adjust Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto space-y-4">
        {/* Date Range */}
        <Collapsible
          open={expandedSections.dateRange}
          onOpenChange={() => toggleSection("dateRange")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </div>
              {expandedSections.dateRange ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 p-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start-date" className="text-xs">
                  From
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) =>
                    handleDateRangeChange("start", e.target.value)
                  }
                  className="text-xs"
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-xs">
                  To
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Media Types */}
        <Collapsible
          open={expandedSections.mediaTypes}
          onOpenChange={() => toggleSection("mediaTypes")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Media Types</span>
                {localFilters.mediaTypes.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {localFilters.mediaTypes.length}
                  </Badge>
                )}
              </div>
              {expandedSections.mediaTypes ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 p-2">
            {mediaTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`media-${type}`}
                  checked={localFilters.mediaTypes.includes(type)}
                  onCheckedChange={() => handleMediaTypeToggle(type)}
                />
                <Label htmlFor={`media-${type}`} className="text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Sentiment */}
        <Collapsible
          open={expandedSections.sentiment}
          onOpenChange={() => toggleSection("sentiment")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>Sentiment</span>
                {localFilters.sentiment.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {localFilters.sentiment.length}
                  </Badge>
                )}
              </div>
              {expandedSections.sentiment ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 p-2">
            {sentimentOptions.map((sentiment) => (
              <div key={sentiment} className="flex items-center space-x-2">
                <Checkbox
                  id={`sentiment-${sentiment}`}
                  checked={localFilters.sentiment.includes(sentiment)}
                  onCheckedChange={() => handleSentimentToggle(sentiment)}
                />
                <Label htmlFor={`sentiment-${sentiment}`} className="text-sm">
                  <Badge className={`${getSentimentColor(sentiment)} text-xs`}>
                    {sentiment}
                  </Badge>
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Outlets */}
        <Collapsible
          open={expandedSections.outlets}
          onOpenChange={() => toggleSection("outlets")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Outlets</span>
                {localFilters.outlets.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {localFilters.outlets.length}
                  </Badge>
                )}
              </div>
              {expandedSections.outlets ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 p-2">
            {popularOutlets.map((outlet) => (
              <div key={outlet} className="flex items-center space-x-2">
                <Checkbox
                  id={`outlet-${outlet}`}
                  checked={localFilters.outlets.includes(outlet)}
                  onCheckedChange={() => handleOutletToggle(outlet)}
                />
                <Label htmlFor={`outlet-${outlet}`} className="text-sm">
                  {outlet}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Minimum Reach */}
        <Collapsible
          open={expandedSections.reach}
          onOpenChange={() => toggleSection("reach")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Minimum Reach</span>
                {localFilters.minReach > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {localFilters.minReach.toLocaleString()}
                  </Badge>
                )}
              </div>
              {expandedSections.reach ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 p-2">
            <Input
              type="number"
              value={localFilters.minReach}
              onChange={(e) => handleMinReachChange(e.target.value)}
              placeholder="Enter minimum reach"
              className="text-sm"
            />
            <div className="flex gap-1 flex-wrap">
              {[1000, 10000, 100000, 1000000].map((reach) => (
                <Button
                  key={reach}
                  variant="outline"
                  size="sm"
                  onClick={() => handleMinReachChange(reach.toString())}
                  className="text-xs"
                >
                  {reach.toLocaleString()}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* Action Buttons */}
      <div className="flex-shrink-0 p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Button onClick={onRunSearch} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Run Search
          </Button>
          <Button onClick={onSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Clear All Filters
        </Button>
      </div>
    </Card>
  );
}
