'use client';

import { DashboardStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SentimentChartProps {
  stats: DashboardStats;
  loading?: boolean;
}

export function SentimentChart({ stats, loading }: SentimentChartProps) {
  const total = stats.sentiment.positive + stats.sentiment.neutral + stats.sentiment.negative;
  
  const sentimentData = [
    {
      label: 'Positive',
      value: stats.sentiment.positive,
      percentage: total > 0 ? (stats.sentiment.positive / total) * 100 : 0,
      color: 'bg-green-500',
    },
    {
      label: 'Neutral',
      value: stats.sentiment.neutral,
      percentage: total > 0 ? (stats.sentiment.neutral / total) * 100 : 0,
      color: 'bg-yellow-500',
    },
    {
      label: 'Negative',
      value: stats.sentiment.negative,
      percentage: total > 0 ? (stats.sentiment.negative / total) * 100 : 0,
      color: 'bg-red-500',
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
                <div className="h-2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No sentiment data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentimentData.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm text-gray-500">
                    {item.value} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}