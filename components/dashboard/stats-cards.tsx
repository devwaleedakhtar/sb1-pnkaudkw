"use client";

import { DashboardStats } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  FileText,
  Users,
  MessageSquare,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Reach",
      value: stats.totalReach.toLocaleString(),
      change: "+12.5%",
      changeType: "increase" as const,
    },
    {
      title: "Media Items",
      value: stats.mediaItems.toString(),
      change: "+8.2%",
      changeType: "increase" as const,
    },
    {
      title: "Influencers",
      value: stats.influencers.toString(),
      change: "+15.3%",
      changeType: "increase" as const,
    },
    {
      title: "Social Posts",
      value: stats.socialPosts.toString(),
      change: "-2.1%",
      changeType: "decrease" as const,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="hover:shadow-md transition-all duration-200 group cursor-pointer border border-gray-200 bg-white"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <div className="flex items-center space-x-1">
                {card.changeType === "increase" ? (
                  <ArrowUp className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    card.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-1 h-12 bg-pink-500 rounded-full" />
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
