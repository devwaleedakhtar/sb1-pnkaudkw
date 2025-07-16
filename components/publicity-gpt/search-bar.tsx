'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Save, Download } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onExport: () => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, onSaveSearch, onExport, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSaveSearch = () => {
    if (query.trim()) {
      onSaveSearch(query.trim());
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for media mentions, keywords, or topics..."
            className="pl-10"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading || !query.trim()}
          className="bg-pink-500 hover:bg-pink-600"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveSearch}
          disabled={!query.trim()}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </form>
    </div>
  );
}