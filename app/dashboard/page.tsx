'use client';

import { useState, useEffect } from 'react';
import { DashboardStats, Activity, Campaign } from '@/lib/types';
import { api } from '@/lib/mock-api';
import { PageHeader } from '@/components/layout/page-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { SentimentChart } from '@/components/dashboard/sentiment-chart';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReach: 0,
    mediaItems: 0,
    influencers: 0,
    socialPosts: 0,
    sentiment: { positive: 0, neutral: 0, negative: 0 },
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      loadCampaignData(selectedCampaign.id);
    }
  }, [selectedCampaign]);

  const loadData = async () => {
    try {
      setLoading(true);
      const campaignsData = await api.getCampaigns();
      setCampaigns(campaignsData);
      
      if (campaignsData.length > 0) {
        const firstCampaign = campaignsData[0];
        setSelectedCampaign(firstCampaign);
        await loadCampaignData(firstCampaign.id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignData = async (campaignId: string) => {
    try {
      const [statsData, activitiesData] = await Promise.all([
        api.getDashboardStats(campaignId),
        api.getActivities(campaignId),
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading campaign data:', error);
    }
  };

  const handleRefresh = async () => {
    if (!selectedCampaign) return;
    
    setRefreshing(true);
    try {
      await loadCampaignData(selectedCampaign.id);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description={selectedCampaign ? `Campaign: ${selectedCampaign.name}` : 'Select a campaign to view dashboard'}
      >
        <Button
          onClick={handleRefresh}
          disabled={refreshing || !selectedCampaign}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button asChild className="bg-pink-500 hover:bg-pink-600">
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </PageHeader>

      {selectedCampaign ? (
        <>
          <StatsCards stats={stats} loading={loading} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityFeed activities={activities} loading={loading} />
            </div>
            <div>
              <SentimentChart stats={stats} loading={loading} />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No Campaign Selected</h2>
          <p className="text-gray-600 mb-6">Create your first campaign to get started</p>
          <Button asChild className="bg-pink-500 hover:bg-pink-600">
            <Link href="/campaigns/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}