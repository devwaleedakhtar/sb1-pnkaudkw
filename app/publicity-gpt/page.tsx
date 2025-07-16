'use client';

import { useState, useEffect } from 'react';
import { MediaResult } from '@/lib/types';
import { api } from '@/lib/mock-api';
import { PageHeader } from '@/components/layout/page-header';
import { SearchBar } from '@/components/publicity-gpt/search-bar';
import { FilterSidebar, MediaFilters } from '@/components/publicity-gpt/filter-sidebar';
import { ResultsTable } from '@/components/publicity-gpt/results-table';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicityGPT() {
  const [mediaResults, setMediaResults] = useState<MediaResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<MediaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    loadMediaResults();
  }, []);

  useEffect(() => {
    setFilteredResults(mediaResults);
  }, [mediaResults]);

  const loadMediaResults = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const data = await api.getMediaResults('1');
      setMediaResults(data);
    } catch (error) {
      console.error('Error loading media results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearching(true);
    setCurrentQuery(query);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter existing results based on query
      const filtered = mediaResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.outlet.toLowerCase().includes(query.toLowerCase()) ||
        result.summary.toLowerCase().includes(query.toLowerCase())
      );
      
      setFilteredResults(filtered);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleFiltersChange = (filters: MediaFilters) => {
    let filtered = [...mediaResults];

    // Apply search query filter
    if (currentQuery) {
      filtered = filtered.filter(result =>
        result.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
        result.outlet.toLowerCase().includes(currentQuery.toLowerCase()) ||
        result.summary.toLowerCase().includes(currentQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filtered = filtered.filter(result => result.publishedAt >= startDate);
    }
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(result => result.publishedAt <= endDate);
    }

    // Apply sentiment filter
    if (filters.sentiment.length > 0) {
      filtered = filtered.filter(result => filters.sentiment.includes(result.sentiment));
    }

    // Apply outlets filter
    if (filters.outlets.length > 0) {
      filtered = filtered.filter(result => filters.outlets.includes(result.outlet));
    }

    // Apply minimum reach filter
    if (filters.minReach > 0) {
      filtered = filtered.filter(result => result.reach >= filters.minReach);
    }

    setFilteredResults(filtered);
  };

  const handleClearFilters = () => {
    if (currentQuery) {
      const filtered = mediaResults.filter(result =>
        result.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
        result.outlet.toLowerCase().includes(currentQuery.toLowerCase()) ||
        result.summary.toLowerCase().includes(currentQuery.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(mediaResults);
    }
  };

  const handleSaveSearch = (query: string) => {
    // Simulate saving search
    console.log('Saving search:', query);
    // In a real app, this would save to backend
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log('Exporting results:', filteredResults);
    // In a real app, this would generate CSV/Excel file
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMediaResults();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="PublicityGPT"
        description="AI-powered media monitoring and sentiment analysis"
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

      <SearchBar
        onSearch={handleSearch}
        onSaveSearch={handleSaveSearch}
        onExport={handleExport}
        loading={searching}
      />

      <div className="flex gap-6">
        <FilterSidebar
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
        
        <div className="flex-1">
          <ResultsTable
            results={filteredResults}
            loading={loading || searching}
          />
        </div>
      </div>
    </div>
  );
}