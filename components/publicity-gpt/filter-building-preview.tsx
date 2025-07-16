"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MediaFilters } from "@/lib/types";
import {
  Sparkles,
  Calendar,
  Globe,
  Heart,
  TrendingUp,
  Building,
  CheckCircle,
  Clock,
  Zap,
  Wand2,
  Database,
  FileText,
} from "lucide-react";

interface FilterBuildingPreviewProps {
  currentFilters: MediaFilters;
  isBuilding: boolean;
  lastMessage?: string;
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
        "Identifying media types...",
        "Setting date parameters...",
        "Configuring sentiment filters...",
        "Selecting relevant outlets...",
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "news":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "social":
        return <Globe className="h-4 w-4 text-purple-500" />;
      case "blog":
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatReach = (reach: number) => {
    if (reach >= 1000000) {
      return `${(reach / 1000000).toFixed(1)}M`;
    } else if (reach >= 1000) {
      return `${(reach / 1000).toFixed(0)}K`;
    }
    return reach.toString();
  };

  const hasActiveFilters = () => {
    return (
      currentFilters.dateRange.start ||
      currentFilters.mediaTypes.length > 0 ||
      currentFilters.sentiment.length > 0 ||
      currentFilters.outlets.length > 0 ||
      currentFilters.minReach > 0
    );
  };

  if (isBuilding) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wand2 className="h-4 w-4 animate-pulse text-blue-500" />
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
          <Sparkles className="h-4 w-4 text-blue-500" />
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
            <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No filters applied</p>
            <p className="text-xs text-gray-400 mt-1">
              Chat with AI to build your search
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Date Range */}
            {currentFilters.dateRange.start && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Date Range</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(
                    currentFilters.dateRange.start
                  ).toLocaleDateString()}
                  {currentFilters.dateRange.end &&
                    ` - ${new Date(
                      currentFilters.dateRange.end
                    ).toLocaleDateString()}`}
                </Badge>
              </div>
            )}

            {/* Media Types */}
            {currentFilters.mediaTypes.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Media Types</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currentFilters.mediaTypes.length} selected
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {currentFilters.mediaTypes.map((type) => (
                    <div key={type} className="flex items-center gap-1">
                      {getMediaTypeIcon(type)}
                      <Badge variant="secondary" className="text-xs capitalize">
                        {type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment */}
            {currentFilters.sentiment.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Sentiment</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currentFilters.sentiment.length} selected
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {currentFilters.sentiment.map((sentiment) => (
                    <Badge
                      key={sentiment}
                      variant="secondary"
                      className={`text-xs capitalize ${getSentimentColor(
                        sentiment
                      )}`}
                    >
                      {sentiment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Outlets */}
            {currentFilters.outlets.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Outlets</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currentFilters.outlets.length} selected
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 pl-6">
                  {currentFilters.outlets.map((outlet) => (
                    <Badge key={outlet} variant="secondary" className="text-xs">
                      {outlet}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Min Reach */}
            {currentFilters.minReach > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Min Reach</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {formatReach(currentFilters.minReach)}+
                </Badge>
              </div>
            )}

            <Separator />

            {/* Filter Summary */}
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 mb-1">Filter Summary:</div>
              <div className="text-sm text-gray-700">
                Searching for{" "}
                {currentFilters.mediaTypes.length > 0 && (
                  <span>{currentFilters.mediaTypes.join(", ")} content</span>
                )}
                {currentFilters.sentiment.length > 0 && (
                  <span>
                    {currentFilters.mediaTypes.length > 0 ? " with " : ""}
                    {currentFilters.sentiment.join(", ")} sentiment
                  </span>
                )}
                {currentFilters.outlets.length > 0 && (
                  <span>
                    {" from "}
                    {currentFilters.outlets.length === 1
                      ? currentFilters.outlets[0]
                      : `${currentFilters.outlets.length} outlets`}
                  </span>
                )}
                {currentFilters.minReach > 0 && (
                  <span>
                    {" "}
                    with {formatReach(currentFilters.minReach)}+ reach
                  </span>
                )}
                {currentFilters.dateRange.start && (
                  <span>
                    {" since "}
                    {new Date(
                      currentFilters.dateRange.start
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
