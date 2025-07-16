'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  onFiltersChange: (filters: MediaFilters) => void;
  onClearFilters: () => void;
}

export interface MediaFilters {
  dateRange: {
    start: string;
    end: string;
  };
  mediaTypes: string[];
  sentiment: string[];
  outlets: string[];
  minReach: number;
}

export function FilterSidebar({ onFiltersChange, onClearFilters }: FilterSidebarProps) {
  const [filters, setFilters] = useState<MediaFilters>({
    dateRange: { start: '', end: '' },
    mediaTypes: [],
    sentiment: [],
    outlets: [],
    minReach: 0,
  });

  const mediaTypes = [
    'Online News',
    'Print Media',
    'Broadcast',
    'Podcast',
    'Blog',
    'Social Media',
  ];

  const sentimentOptions = [
    'Positive',
    'Neutral',
    'Negative',
  ];

  const popularOutlets = [
    'TechCrunch',
    'Wired',
    'CNN Business',
    'Forbes',
    'Reuters',
    'Associated Press',
  ];

  const updateFilters = (key: keyof MediaFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: 'mediaTypes' | 'sentiment' | 'outlets', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters(key, newArray);
  };

  const handleClearFilters = () => {
    const clearedFilters: MediaFilters = {
      dateRange: { start: '', end: '' },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Date Range</Label>
          <div className="space-y-2">
            <Input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => updateFilters('dateRange', { ...filters.dateRange, start: e.target.value })}
              placeholder="Start date"
            />
            <Input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => updateFilters('dateRange', { ...filters.dateRange, end: e.target.value })}
              placeholder="End date"
            />
          </div>
        </div>

        <Separator />

        {/* Media Types */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Media Type</Label>
          <div className="space-y-2">
            {mediaTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={filters.mediaTypes.includes(type)}
                  onCheckedChange={() => toggleArrayFilter('mediaTypes', type)}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sentiment */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Sentiment</Label>
          <div className="space-y-2">
            {sentimentOptions.map((sentiment) => (
              <div key={sentiment} className="flex items-center space-x-2">
                <Checkbox
                  id={sentiment}
                  checked={filters.sentiment.includes(sentiment.toLowerCase())}
                  onCheckedChange={() => toggleArrayFilter('sentiment', sentiment.toLowerCase())}
                />
                <Label htmlFor={sentiment} className="text-sm">{sentiment}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Outlets */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Popular Outlets</Label>
          <div className="space-y-2">
            {popularOutlets.map((outlet) => (
              <div key={outlet} className="flex items-center space-x-2">
                <Checkbox
                  id={outlet}
                  checked={filters.outlets.includes(outlet)}
                  onCheckedChange={() => toggleArrayFilter('outlets', outlet)}
                />
                <Label htmlFor={outlet} className="text-sm">{outlet}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Minimum Reach */}
        <div>
          <Label htmlFor="minReach" className="text-sm font-medium mb-3 block">
            Minimum Reach
          </Label>
          <Input
            id="minReach"
            type="number"
            value={filters.minReach || ''}
            onChange={(e) => updateFilters('minReach', parseInt(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
      </CardContent>
    </Card>
  );
}