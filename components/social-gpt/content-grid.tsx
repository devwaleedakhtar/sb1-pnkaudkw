'use client';

import { SocialPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share, MessageCircle, Eye, ExternalLink, Instagram, Twitter, Youtube } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';
import { formatDistanceToNow } from 'date-fns';

interface ContentGridProps {
  posts: SocialPost[];
  loading?: boolean;
}

export function ContentGrid({ posts, loading }: ContentGridProps) {
  const getPlatformIcon = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'tiktok': return TikTokIcon;
      case 'youtube': return Youtube;
      default: return Instagram;
    }
  };

  const getPlatformColor = (platform: SocialPost['platform']) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'twitter': return 'bg-blue-100 text-blue-800';
      case 'tiktok': return 'bg-purple-100 text-purple-800';
      case 'youtube': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const generateAvatarUrl = (author: string) => {
    // Generate consistent avatar URLs based on author name
    const seed = author.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarId = (seed % 70) + 1; // Pexels has many portrait photos
    return `https://images.pexels.com/photos/${1000000 + avatarId}/pexels-photo-${1000000 + avatarId}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Social Posts Found</h3>
        <p className="text-gray-600">Social media content will appear here as it's discovered</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => {
        const PlatformIcon = getPlatformIcon(post.platform);
        
        return (
          <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={generateAvatarUrl(post.author)} alt={post.author} />
                    <AvatarFallback>{post.author[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">@{post.author}</span>
                      <Badge className={getPlatformColor(post.platform)}>
                        <PlatformIcon className="h-3 w-3 mr-1" />
                        {post.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatDistanceToNow(post.publishedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Content */}
              <p className="text-gray-700 line-clamp-4">{post.content}</p>
              
              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.slice(0, 3).map((hashtag) => (
                    <Badge key={hashtag} variant="outline" className="text-xs">
                      {hashtag}
                    </Badge>
                  ))}
                  {post.hashtags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.hashtags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Engagement Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{formatNumber(post.likes)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share className="h-4 w-4 text-blue-500" />
                  <span>{formatNumber(post.shares)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span>{formatNumber(post.comments)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4 text-purple-500" />
                  <span>{formatNumber(post.reach)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Post
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}