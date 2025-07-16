'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Database, Globe } from 'lucide-react';

interface InfluencerSearchProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export interface SearchParams {
  query: string;
  platform: string;
  category: string;
  minFollowers: number;
  maxFollowers: number;
  minEngagement: number;
  useInternalDb: boolean;
}

export function InfluencerSearch({ onSearch, loading }: InfluencerSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    platform: 'all',
    category: 'all',
    minFollowers: 1000,
    maxFollowers: 10000000,
    minEngagement: 1,
    useInternalDb: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const updateParam = (key: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'Twitter' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'gaming', label: 'Gaming' },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Query */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchParams.query}
                onChange={(e) => updateParam('query', e.target.value)}
                placeholder="Search for influencers by keywords, niche, or name..."
                className="pl-10"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={searchParams.platform} onValueChange={(value) => updateParam('platform', value)}>
                <SelectTrigger>
                  <SelectValue />
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

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={searchParams.category} onValueChange={(value) => updateParam('category', value)}>
                <SelectTrigger>
                  <SelectValue />
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

            <div>
              <Label htmlFor="minFollowers">Min Followers</Label>
              <Input
                id="minFollowers"
                type="number"
                value={searchParams.minFollowers}
                onChange={(e) => updateParam('minFollowers', parseInt(e.target.value) || 0)}
                placeholder="1000"
              />
            </div>

            <div>
              <Label htmlFor="minEngagement">Min Engagement %</Label>
              <Input
                id="minEngagement"
                type="number"
                step="0.1"
                value={searchParams.minEngagement}
                onChange={(e) => updateParam('minEngagement', parseFloat(e.target.value) || 0)}
                placeholder="1.0"
              />
            </div>
          </div>

          {/* Database Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {searchParams.useInternalDb ? (
                <Database className="h-5 w-5 text-pink-500" />
              ) : (
                <Globe className="h-5 w-5 text-blue-500" />
              )}
              <div>
                <Label htmlFor="dbToggle" className="font-medium">
                  {searchParams.useInternalDb ? 'Internal Database' : 'Broad Search'}
                </Label>
                <p className="text-sm text-gray-600">
                  {searchParams.useInternalDb 
                    ? 'Search our curated database of verified influencers'
                    : 'Search across all public social media platforms'
                  }
                </p>
              </div>
            </div>
            <Switch
              id="dbToggle"
              checked={searchParams.useInternalDb}
              onCheckedChange={(checked) => updateParam('useInternalDb', checked)}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}