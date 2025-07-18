"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Users,
  Hash,
  TrendingUp,
  CheckCircle,
  Database,
  X,
  Save,
} from "lucide-react";
import { InfluencerFilters } from "@/lib/types";

interface ManualFilterAdjustmentProps {
  currentFilters: InfluencerFilters;
  onSave: (filters: InfluencerFilters) => void;
  onCancel: () => void;
}

export function ManualFilterAdjustment({
  currentFilters,
  onSave,
  onCancel,
}: ManualFilterAdjustmentProps) {
  const [filters, setFilters] = useState<InfluencerFilters>(currentFilters);

  const handleSave = () => {
    onSave(filters);
  };

  const platforms = [
    { value: "all", label: "All Platforms" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food & Cooking" },
    { value: "travel", label: "Travel" },
    { value: "beauty", label: "Beauty" },
    { value: "gaming", label: "Gaming" },
  ];

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-purple-500" />
            Adjust Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            Platform
          </Label>
          <Select
            value={filters.platform}
            onValueChange={(value) =>
              setFilters({ ...filters, platform: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" />
            Category
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Followers Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            Followers Range
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Minimum</Label>
              <Input
                type="number"
                value={filters.minFollowers}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minFollowers: parseInt(e.target.value) || 1000,
                  })
                }
                placeholder="1000"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Maximum</Label>
              <Input
                type="number"
                value={filters.maxFollowers}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxFollowers: parseInt(e.target.value) || 10000000,
                  })
                }
                placeholder="10000000"
              />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Current range: {formatFollowerCount(filters.minFollowers)} -{" "}
            {formatFollowerCount(filters.maxFollowers)}
          </div>
        </div>

        {/* Engagement */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            Minimum Engagement (%)
          </Label>
          <Input
            type="number"
            value={filters.minEngagement}
            onChange={(e) =>
              setFilters({
                ...filters,
                minEngagement: parseFloat(e.target.value) || 1,
              })
            }
            placeholder="1"
          />
        </div>

        {/* Verified Only */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            Verified Only
          </Label>
          <Switch
            checked={filters.verified || false}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, verified: checked })
            }
          />
        </div>

        <Separator />

        {/* Internal Database Toggle */}
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gray-500" />
            Use Internal Database
          </Label>
          <Switch
            checked={filters.useInternalDb}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, useInternalDb: checked })
            }
          />
        </div>

        {/* Filter Summary */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Filter Summary:
          </div>
          <div className="space-y-1">
            {filters.platform !== "all" && (
              <Badge variant="outline" className="text-xs">
                Platform: {filters.platform}
              </Badge>
            )}
            {filters.category !== "all" && (
              <Badge variant="outline" className="text-xs">
                Category: {filters.category}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Followers: {formatFollowerCount(filters.minFollowers)} -{" "}
              {formatFollowerCount(filters.maxFollowers)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Engagement: {filters.minEngagement}%+
            </Badge>
            {filters.verified && (
              <Badge variant="outline" className="text-xs">
                Verified Only
              </Badge>
            )}
            <Badge
              variant={filters.useInternalDb ? "default" : "secondary"}
              className="text-xs"
            >
              {filters.useInternalDb ? "Internal DB" : "Broad Search"}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
