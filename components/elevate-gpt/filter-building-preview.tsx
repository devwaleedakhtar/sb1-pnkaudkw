"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Wand2,
  Users,
  Hash,
  TrendingUp,
  CheckCircle,
  Globe,
  Database,
  Sparkles,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { InfluencerFilters } from "@/lib/types";

interface FilterBuildingPreviewProps {
  currentFilters: InfluencerFilters;
  isBuilding: boolean;
  lastMessage: string;
}

export function FilterBuildingPreview({
  currentFilters,
  isBuilding,
  lastMessage,
}: FilterBuildingPreviewProps) {
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [buildingSteps, setBuildingSteps] = useState<string[]>([]);

  useEffect(() => {
    if (isBuilding) {
      setBuildingProgress(0);
      setBuildingSteps([]);

      const steps = [
        "Analyzing your request...",
        "Identifying platform preferences...",
        "Setting category filters...",
        "Configuring follower ranges...",
        "Applying engagement criteria...",
        "Finalizing search parameters...",
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setBuildingSteps((prev) => [...prev, steps[currentStep]]);
          setBuildingProgress(((currentStep + 1) / steps.length) * 100);
          currentStep++;
        } else {
          clearInterval(interval);
        }
      }, 600);

      return () => clearInterval(interval);
    }
  }, [isBuilding]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-500" />;
      case "tiktok":
        return <div className="h-4 w-4 bg-black rounded-full" />;
      default:
        return <Globe className="h-4 w-4 text-gray-500" />;
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

  const getInfluencerTier = (min: number, max: number) => {
    if (max <= 100000) return "Micro-influencers";
    if (max <= 1000000) return "Macro-influencers";
    return "Mega-influencers";
  };

  const hasActiveFilters = () => {
    return (
      currentFilters.platform !== "all" ||
      currentFilters.category !== "all" ||
      currentFilters.minFollowers > 1000 ||
      currentFilters.maxFollowers < 10000000 ||
      currentFilters.minEngagement > 1 ||
      currentFilters.verified
    );
  };

  if (isBuilding) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wand2 className="h-4 w-4 animate-pulse text-purple-500" />
            Building Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing...</span>
              <span>{Math.round(buildingProgress)}%</span>
            </div>
            <Progress value={buildingProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            {buildingSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">{step}</span>
              </div>
            ))}
          </div>

          {lastMessage && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 font-medium mb-1">
                Your Request:
              </div>
              <div className="text-sm text-blue-800">{lastMessage}</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-purple-500" />
          Search Filters
          {hasActiveFilters() && (
            <Badge variant="secondary" className="ml-auto">
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasActiveFilters() ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No filters applied</p>
            <p className="text-xs text-gray-400 mt-1">
              Chat with AI to build your search
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Platform */}
            {currentFilters.platform !== "all" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(currentFilters.platform)}
                  <span className="text-sm font-medium">Platform</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {currentFilters.platform}
                </Badge>
              </div>
            )}

            {/* Category */}
            {currentFilters.category !== "all" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Category</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {currentFilters.category}
                </Badge>
              </div>
            )}

            {/* Followers */}
            {(currentFilters.minFollowers > 1000 ||
              currentFilters.maxFollowers < 10000000) && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Followers</span>
                  </div>
                  <Badge variant="outline">
                    {formatFollowerCount(currentFilters.minFollowers)} -{" "}
                    {formatFollowerCount(currentFilters.maxFollowers)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 pl-6">
                  {getInfluencerTier(
                    currentFilters.minFollowers,
                    currentFilters.maxFollowers
                  )}
                </div>
              </div>
            )}

            {/* Engagement */}
            {currentFilters.minEngagement > 1 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Min Engagement</span>
                </div>
                <Badge variant="outline">
                  {currentFilters.minEngagement}%+
                </Badge>
              </div>
            )}

            {/* Verified */}
            {currentFilters.verified && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Verified Only</span>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  ✓ Required
                </Badge>
              </div>
            )}

            <Separator />

            {/* Search Scope */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Search Scope</span>
              </div>
              <Badge
                variant={currentFilters.useInternalDb ? "default" : "secondary"}
              >
                {currentFilters.useInternalDb ? "Internal DB" : "Broad Search"}
              </Badge>
            </div>

            {/* Filter Summary */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 mb-1">Filter Summary:</div>
              <div className="text-sm text-gray-700">
                {currentFilters.platform !== "all" && (
                  <span className="capitalize">{currentFilters.platform} </span>
                )}
                {currentFilters.category !== "all" && (
                  <span className="capitalize">{currentFilters.category} </span>
                )}
                influencers
                {(currentFilters.minFollowers > 1000 ||
                  currentFilters.maxFollowers < 10000000) && (
                  <span>
                    {" "}
                    with {formatFollowerCount(currentFilters.minFollowers)}-
                    {formatFollowerCount(currentFilters.maxFollowers)} followers
                  </span>
                )}
                {currentFilters.minEngagement > 1 && (
                  <span> and {currentFilters.minEngagement}%+ engagement</span>
                )}
                {currentFilters.verified && <span> (verified only)</span>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
