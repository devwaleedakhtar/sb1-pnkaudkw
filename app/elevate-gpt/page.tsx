'use client';

import { useState, useEffect } from 'react';
import { Influencer } from '@/lib/types';
import { api } from '@/lib/mock-api';
import { PageHeader } from '@/components/layout/page-header';
import { BriefUpload } from '@/components/elevate-gpt/brief-upload';
import { InfluencerSearch, SearchParams } from '@/components/elevate-gpt/influencer-search';
import { InfluencerGrid } from '@/components/elevate-gpt/influencer-grid';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function ElevateGPT() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInfluencers();
  }, []);

  useEffect(() => {
    setFilteredInfluencers(influencers);
  }, [influencers]);

  const loadInfluencers = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const data = await api.getInfluencers('1');
      setInfluencers(data);
    } catch (error) {
      console.error('Error loading influencers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQueries = (brief: string) => {
    console.log('Generated queries from brief:', brief);
    // In a real app, this would use AI to generate search queries
  };

  const handleSearch = async (params: SearchParams) => {
    setSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filtered = [...influencers];

      // Apply query filter
      if (params.query) {
        filtered = filtered.filter(inf =>
          inf.name.toLowerCase().includes(params.query.toLowerCase()) ||
          inf.category.toLowerCase().includes(params.query.toLowerCase())
        );
      }

      // Apply platform filter
      if (params.platform !== 'all') {
        filtered = filtered.filter(inf => inf.platform === params.platform);
      }

      // Apply category filter
      if (params.category !== 'all') {
        filtered = filtered.filter(inf => 
          inf.category.toLowerCase().includes(params.category.toLowerCase())
        );
      }

      // Apply follower range filter
      filtered = filtered.filter(inf => 
        inf.followers >= params.minFollowers && 
        inf.followers <= params.maxFollowers
      );

      // Apply engagement filter
      filtered = filtered.filter(inf => inf.engagement >= params.minEngagement);

      // If using broad search, simulate finding more influencers
      if (!params.useInternalDb && params.query) {
        // Add some mock additional influencers for broad search
        const additionalInfluencers: Influencer[] = [
          {
            id: 'broad-1',
            campaignId: '1',
            name: 'Alex TechGuru',
            platform: 'youtube',
            followers: 750000,
            engagement: 3.5,
            category: 'Technology',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            verified: true,
          },
          {
            id: 'broad-2',
            campaignId: '1',
            name: 'Jessica SmartLiving',
            platform: 'instagram',
            followers: 320000,
            engagement: 4.8,
            category: 'Lifestyle',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
            verified: false,
          },
        ];
        filtered = [...filtered, ...additionalInfluencers];
      }

      setFilteredInfluencers(filtered);
    } catch (error) {
      console.error('Error searching influencers:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleExportShortlist = (shortlisted: Influencer[]) => {
    console.log('Exporting shortlist:', shortlisted);
    // In a real app, this would generate CSV/Excel file
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInfluencers();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="ElevateGPT"
        description="AI-powered influencer discovery and analysis"
      >
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </PageHeader>

      <BriefUpload
        onGenerateQueries={handleGenerateQueries}
        loading={searching}
      />

      <InfluencerSearch
        onSearch={handleSearch}
        loading={searching}
      />

      <InfluencerGrid
        influencers={filteredInfluencers}
        loading={loading || searching}
        onExportShortlist={handleExportShortlist}
      />
    </div>
  );
}