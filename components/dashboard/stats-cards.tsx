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
      icon: TrendingUp,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      change: "+12.5%",
      changeType: "increase" as const,
    },
    {
      title: "Media Items",
      value: stats.mediaItems.toString(),
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      change: "+8.2%",
      changeType: "increase" as const,
    },
    {
      title: "Influencers",
      value: stats.influencers.toString(),
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      change: "+15.3%",
      changeType: "increase" as const,
    },
    {
      title: "Social Posts",
      value: stats.socialPosts.toString(),
      icon: MessageSquare,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
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
      {cards.map((card) => (
        <Card
          key={card.title}
          className="hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-lg"
        >
          <CardContent
            className={`p-6 bg-gradient-to-br ${card.bgGradient} relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {card.changeType === "increase" ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                {card.value}
              </h3>
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-600 transition-colors">
                {card.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
