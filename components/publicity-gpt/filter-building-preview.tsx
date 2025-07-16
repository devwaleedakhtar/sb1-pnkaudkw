"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MediaFilters } from "@/lib/types";
import {
  Sparkles,
  Calendar,
  Globe,
  Heart,
  TrendingUp,
  Building,
  Check,
  Clock,
  Zap,
} from "lucide-react";

interface FilterStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "pending" | "building" | "completed";
  value?: string;
  description?: string;
}

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
  const [buildingSteps, setBuildingSteps] = useState<FilterStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize building steps based on the message
  useEffect(() => {
    if (lastMessage && isBuilding) {
      const steps = analyzeMessageForSteps(lastMessage);
      setBuildingSteps(steps);
      setCurrentStep(0);

      // Simulate progressive building
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [lastMessage, isBuilding]);

  // Update steps status based on current step
  useEffect(() => {
    setBuildingSteps((prev) =>
      prev.map((step, index) => ({
        ...step,
        status:
          index < currentStep
            ? "completed"
            : index === currentStep
            ? "building"
            : "pending",
      }))
    );
  }, [currentStep]);

  const analyzeMessageForSteps = (message: string): FilterStep[] => {
    const steps: FilterStep[] = [];
    const lowerMessage = message.toLowerCase();

    // Date range step
    if (
      lowerMessage.includes("last week") ||
      lowerMessage.includes("past week") ||
      lowerMessage.includes("recent") ||
      lowerMessage.includes("today")
    ) {
      steps.push({
        id: "date",
        label: "Date Range",
        icon: <Calendar className="h-4 w-4" />,
        status: "pending",
        description: "Setting time period for search",
      });
    }

    // Media types step
    if (
      lowerMessage.includes("social") ||
      lowerMessage.includes("news") ||
      lowerMessage.includes("blog") ||
      lowerMessage.includes("article")
    ) {
      steps.push({
        id: "media",
        label: "Media Types",
        icon: <Globe className="h-4 w-4" />,
        status: "pending",
        description: "Identifying content sources",
      });
    }

    // Sentiment step
    if (
      lowerMessage.includes("positive") ||
      lowerMessage.includes("negative") ||
      lowerMessage.includes("neutral") ||
      lowerMessage.includes("sentiment")
    ) {
      steps.push({
        id: "sentiment",
        label: "Sentiment",
        icon: <Heart className="h-4 w-4" />,
        status: "pending",
        description: "Analyzing emotional tone",
      });
    }

    // Reach step
    if (
      lowerMessage.includes("high reach") ||
      lowerMessage.includes("popular") ||
      lowerMessage.includes("viral") ||
      lowerMessage.includes("reach")
    ) {
      steps.push({
        id: "reach",
        label: "Reach Filter",
        icon: <TrendingUp className="h-4 w-4" />,
        status: "pending",
        description: "Setting audience size requirements",
      });
    }

    // Outlets step
    if (
      lowerMessage.includes("outlet") ||
      lowerMessage.includes("source") ||
      lowerMessage.includes("publication") ||
      lowerMessage.includes("techcrunch") ||
      lowerMessage.includes("wired") ||
      lowerMessage.includes("specific")
    ) {
      steps.push({
        id: "outlets",
        label: "Outlets",
        icon: <Building className="h-4 w-4" />,
        status: "pending",
        description: "Selecting news sources",
      });
    }

    // Always add a final step for compilation
    steps.push({
      id: "compile",
      label: "Compiling",
      icon: <Zap className="h-4 w-4" />,
      status: "pending",
      description: "Finalizing search parameters",
    });

    return steps;
  };

  const getStatusIcon = (status: FilterStep["status"]) => {
    switch (status) {
      case "completed":
        return <Check className="h-3 w-3 text-green-500" />;
      case "building":
        return (
          <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      case "pending":
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const hasFilters =
    currentFilters &&
    Object.keys(currentFilters).some((key) => {
      const value = currentFilters[key as keyof MediaFilters];
      return Array.isArray(value) ? value.length > 0 : value;
    });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Filter Builder
        </CardTitle>
        <p className="text-sm text-gray-600">
          {isBuilding
            ? "Building filters from your request..."
            : "Filters are built as you chat with the AI"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Building Steps */}
        {buildingSteps.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Processing:</div>
            {buildingSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {step.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Filters */}
        {hasFilters && !isBuilding && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Current Filters:
              </div>

              {currentFilters.dateRange.start && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
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

              {currentFilters.mediaTypes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Globe className="h-3 w-3" />
                    Media Types:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentFilters.mediaTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentFilters.sentiment.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Heart className="h-3 w-3" />
                    Sentiment:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentFilters.sentiment.map((sentiment) => (
                      <Badge
                        key={sentiment}
                        variant="secondary"
                        className="text-xs"
                      >
                        {sentiment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentFilters.outlets.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Building className="h-3 w-3" />
                    Outlets:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {currentFilters.outlets.map((outlet) => (
                      <Badge
                        key={outlet}
                        variant="secondary"
                        className="text-xs"
                      >
                        {outlet}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {currentFilters.minReach > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <Badge variant="outline" className="text-xs">
                    Min Reach: {currentFilters.minReach.toLocaleString()}
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!hasFilters && !isBuilding && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-2">No filters built yet</p>
            <p className="text-xs text-gray-400 mb-3">
              Start chatting with the AI to automatically build search filters
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-medium">Try asking:</p>
              <p>• "Show me positive coverage from last week"</p>
              <p>• "Find articles about our product launch"</p>
              <p>• "Get social media mentions with high reach"</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
