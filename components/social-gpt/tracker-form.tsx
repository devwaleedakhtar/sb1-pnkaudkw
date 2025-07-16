'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SocialTracker } from '@/lib/types';
import { api } from '@/lib/mock-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, ArrowLeft, Plus, X, Instagram, Twitter, Youtube } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';

interface TrackerFormProps {
  campaignId: string;
  tracker?: SocialTracker;
  onSave?: (tracker: SocialTracker) => void;
}

export function TrackerForm({ campaignId, tracker, onSave }: TrackerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: tracker?.name || '',
    keywords: tracker?.keywords || [],
    hashtags: tracker?.hashtags || [],
    platforms: tracker?.platforms || [] as ('instagram' | 'twitter' | 'tiktok' | 'youtube')[],
    startDate: tracker?.startDate?.toISOString().split('T')[0] || '',
    endDate: tracker?.endDate?.toISOString().split('T')[0] || '',
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-500' },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, color: 'text-purple-500' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  ] as const;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tracker name is required';
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform must be selected';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      const trackerData = {
        campaignId,
        name: formData.name,
        keywords: formData.keywords,
        hashtags: formData.hashtags,
        platforms: formData.platforms,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: 'active' as const,
      };

      let savedTracker: SocialTracker;
      if (tracker) {
        savedTracker = await api.updateSocialTracker(tracker.id, trackerData) as SocialTracker;
      } else {
        savedTracker = await api.createSocialTracker(trackerData);
      }

      onSave?.(savedTracker);
      router.push('/social-gpt');
    } catch (error) {
      console.error('Error saving tracker:', error);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
      if (errors.keywords) {
        setErrors(prev => ({ ...prev, keywords: '' }));
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addHashtag = () => {
    const hashtag = hashtagInput.trim().startsWith('#') 
      ? hashtagInput.trim() 
      : `#${hashtagInput.trim()}`;
    
    if (hashtag !== '#' && !formData.hashtags.includes(hashtag)) {
      setFormData(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtag: string) => {
    setFormData(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const togglePlatform = (platformId: string) => {
    const platform = platformId as 'instagram' | 'twitter' | 'tiktok' | 'youtube';
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
    if (errors.platforms) {
      setErrors(prev => ({ ...prev, platforms: '' }));
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {tracker ? 'Edit Social Tracker' : 'Create New Social Tracker'}
        </CardTitle>
        <CardDescription>
          {tracker ? 'Update your social media tracking settings' : 'Set up social media monitoring for your campaign'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tracker Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tracker Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter tracker name (e.g., Brand Mentions, Product Launch)"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Keywords to Track *</Label>
            <div className="flex space-x-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Enter keyword or phrase"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" onClick={addKeyword} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                    <span>{keyword}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {errors.keywords && <p className="text-sm text-red-500">{errors.keywords}</p>}
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label>Hashtags to Monitor</Label>
            <div className="flex space-x-2">
              <Input
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                placeholder="Enter hashtag (with or without #)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
              />
              <Button type="button" onClick={addHashtag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.hashtags.map((hashtag) => (
                  <Badge key={hashtag} variant="outline" className="flex items-center space-x-1">
                    <span>{hashtag}</span>
                    <button
                      type="button"
                      onClick={() => removeHashtag(hashtag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Platform Selection */}
          <div className="space-y-4">
            <div>
              <Label>Platforms to Monitor *</Label>
              <p className="text-sm text-gray-600 mt-1">Select which social media platforms to track</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                
                return (
                  <div
                    key={platform.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-pink-500 bg-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`h-6 w-6 ${isSelected ? 'text-pink-500' : platform.color}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                        {platform.name}
                      </span>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => togglePlatform(platform.id)}
                        className="pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.platforms && <p className="text-sm text-red-500">{errors.platforms}</p>}
          </div>

          <Separator />

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {tracker ? 'Update Tracker' : 'Create Tracker'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}