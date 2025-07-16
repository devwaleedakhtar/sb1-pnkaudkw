'use client';

import { useState } from 'react';
import { SocialTracker } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MoreHorizontal, Play, Pause, Edit, Trash2, Eye, Instagram, Twitter, Youtube } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TikTokIcon } from './tiktok-icon';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface TrackerListProps {
  trackers: SocialTracker[];
  loading?: boolean;
  onStatusChange: (trackerId: string, status: SocialTracker['status']) => void;
  onDelete: (trackerId: string) => void;
  onViewResults: (trackerId: string) => void;
}

export function TrackerList({ trackers, loading, onStatusChange, onDelete, onViewResults }: TrackerListProps) {
  const getStatusColor = (status: SocialTracker['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'tiktok': return TikTokIcon;
      case 'youtube': return Youtube;
      default: return Instagram;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'text-pink-500';
      case 'twitter': return 'text-blue-500';
      case 'tiktok': return 'text-purple-500';
      case 'youtube': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getProgress = (tracker: SocialTracker) => {
    const totalDays = differenceInDays(tracker.endDate, tracker.startDate);
    const elapsedDays = differenceInDays(new Date(), tracker.startDate);
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trackers.map((tracker) => (
        <Card key={tracker.id} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{tracker.name}</CardTitle>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getStatusColor(tracker.status)}>
                    {tracker.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(tracker.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewResults(tracker.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Results
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/social-gpt/trackers/${tracker.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Tracker
                    </Link>
                  </DropdownMenuItem>
                  {tracker.status === 'active' ? (
                    <DropdownMenuItem onClick={() => onStatusChange(tracker.id, 'paused')}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Tracker
                    </DropdownMenuItem>
                  ) : tracker.status === 'paused' ? (
                    <DropdownMenuItem onClick={() => onStatusChange(tracker.id, 'active')}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume Tracker
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem 
                    onClick={() => onDelete(tracker.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Tracker
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Keywords */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Keywords</p>
              <div className="flex flex-wrap gap-1">
                {tracker.keywords.slice(0, 3).map((keyword) => (
                  <Badge key={keyword} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
                {tracker.keywords.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tracker.keywords.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Platforms</p>
              <div className="flex space-x-2">
                {tracker.platforms.map((platform) => {
                  const Icon = getPlatformIcon(platform);
                  return (
                    <div key={platform} className="flex items-center">
                      <Icon className={`h-4 w-4 ${getPlatformColor(platform)}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Posts Found</p>
                <p className="font-semibold">{tracker.postsCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Reach</p>
                <p className="font-semibold">{formatNumber(tracker.totalReach)}</p>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-600">{Math.round(getProgress(tracker))}%</span>
              </div>
              <Progress value={getProgress(tracker)} className="h-2" />
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => onViewResults(tracker.id)}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Results
              </Button>
              {tracker.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(tracker.id, 'paused')}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              )}
              {tracker.status === 'paused' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStatusChange(tracker.id, 'active')}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}