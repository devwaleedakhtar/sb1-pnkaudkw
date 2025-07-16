'use client';

import { useState, useEffect, useContext } from 'react';
import { SocialPost, SocialTracker } from '@/lib/types';
import { api } from '@/lib/mock-api';
import { PageHeader } from '@/components/layout/page-header';
import { TrackerList } from '@/components/social-gpt/tracker-list';
import { ContentGrid } from '@/components/social-gpt/content-grid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, RefreshCw, Target, Eye, MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';

export default function SocialGPT() {
  const [trackers, setTrackers] = useState<SocialTracker[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [selectedTracker, setSelectedTracker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('trackers');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const [trackersData, postsData] = await Promise.all([
        api.getSocialTrackers('1'),
        api.getSocialPosts('1'),
      ]);
      setTrackers(trackersData);
      setSocialPosts(postsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (trackerId: string, status: SocialTracker['status']) => {
    try {
      await api.updateSocialTracker(trackerId, { status });
      setTrackers(prev => prev.map(t => t.id === trackerId ? { ...t, status } : t));
    } catch (error) {
      console.error('Error updating tracker status:', error);
    }
  };

  const handleDelete = async (trackerId: string) => {
    // In a real app, this would call an API to delete the tracker
    setTrackers(prev => prev.filter(t => t.id !== trackerId));
  };

  const handleViewResults = (trackerId: string) => {
    setSelectedTracker(trackerId);
    setActiveTab('content');
  };

  const getFilteredPosts = () => {
    if (!selectedTracker) return socialPosts;
    return socialPosts.filter(post => post.trackerId === selectedTracker);
  };

  const getSelectedTrackerName = () => {
    if (!selectedTracker) return 'All Content';
    const tracker = trackers.find(t => t.id === selectedTracker);
    return tracker ? tracker.name : 'All Content';
  };

  const getTotalStats = () => {
    const posts = getFilteredPosts();
    return {
      totalPosts: posts.length,
      totalReach: posts.reduce((sum, post) => sum + post.reach, 0),
      totalEngagement: posts.reduce((sum, post) => sum + post.likes + post.shares + post.comments, 0),
    };
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = getTotalStats();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="SocialGPT"
        description="AI-powered social media monitoring and analytics"
      >
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button asChild className="bg-pink-500 hover:bg-pink-600">
          <Link href="/social-gpt/trackers/new">
            <Plus className="h-4 w-4 mr-2" />
            New Tracker
          </Link>
        </Button>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trackers" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Trackers ({trackers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>{getSelectedTrackerName()} ({stats.totalPosts})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trackers" className="space-y-6">
          {trackers.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">No Social Trackers</h2>
              <p className="text-gray-600 mb-6">Create your first social media tracker to start monitoring</p>
              <Button asChild className="bg-pink-500 hover:bg-pink-600">
                <Link href="/social-gpt/trackers/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tracker
                </Link>
              </Button>
            </div>
          ) : (
            <TrackerList
              trackers={trackers}
              loading={loading}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onViewResults={handleViewResults}
            />
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-pink-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalReach)}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalEngagement)}</p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          <ContentGrid posts={getFilteredPosts()} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}