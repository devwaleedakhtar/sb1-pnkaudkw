'use client';

import { useState } from 'react';
import { Influencer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Star, CheckCircle, Heart, Download, Plus } from 'lucide-react';

interface InfluencerGridProps {
  influencers: Influencer[];
  loading?: boolean;
  onExportShortlist: (shortlisted: Influencer[]) => void;
}

export function InfluencerGrid({ influencers, loading, onExportShortlist }: InfluencerGridProps) {
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());

  const toggleShortlist = (influencerId: string) => {
    const newShortlisted = new Set(shortlisted);
    if (newShortlisted.has(influencerId)) {
      newShortlisted.delete(influencerId);
    } else {
      newShortlisted.add(influencerId);
    }
    setShortlisted(newShortlisted);
  };

  const handleExportShortlist = () => {
    const shortlistedInfluencers = influencers.filter(inf => shortlisted.has(inf.id));
    onExportShortlist(shortlistedInfluencers);
  };

  const getPlatformColor = (platform: Influencer['platform']) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'twitter': return 'bg-blue-100 text-blue-800';
      case 'tiktok': return 'bg-purple-100 text-purple-800';
      case 'youtube': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Search Results</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Search Results ({influencers.length})
        </h3>
        {shortlisted.size > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {shortlisted.size} selected
            </span>
            <Button
              onClick={handleExportShortlist}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Shortlist
            </Button>
          </div>
        )}
      </div>

      {influencers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Influencers Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((influencer) => (
            <Card key={influencer.id} className="hover:shadow-lg transition-shadow duration-200 relative">
              <div className="absolute top-4 right-4">
                <Checkbox
                  checked={shortlisted.has(influencer.id)}
                  onCheckedChange={() => toggleShortlist(influencer.id)}
                  className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={influencer.avatar} alt={influencer.name} />
                    <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{influencer.name}</CardTitle>
                      {influencer.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <Badge className={getPlatformColor(influencer.platform)}>
                      {influencer.platform}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Followers</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="font-semibold">{formatFollowers(influencer.followers)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-pink-500 mr-1" />
                      <span className="font-semibold">{influencer.engagement}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <Badge variant="outline">{influencer.category}</Badge>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-pink-500 hover:bg-pink-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}