'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Campaign } from '@/lib/types';
import { api } from '@/lib/mock-api';
import { ChevronDown, BarChart3, Zap, Users, MessageSquare, Plus, Settings, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  selectedCampaign: Campaign | null;
  onCampaignChange: (campaign: Campaign | null) => void;
}

export function Sidebar({ selectedCampaign, onCampaignChange }: SidebarProps) {
  const pathname = usePathname();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await api.getCampaigns();
      setCampaigns(data);
      if (data.length > 0 && !selectedCampaign) {
        onCampaignChange(data[0]);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'PublicityGPT', href: '/publicity-gpt', icon: Zap },
    { name: 'ElevateGPT', href: '/elevate-gpt', icon: Users },
    { name: 'SocialGPT', href: '/social-gpt', icon: MessageSquare },
  ];

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Building className="h-8 w-8 text-pink-500" />
        <span className="ml-2 text-xl font-bold text-gray-900">AGM</span>
      </div>

      {/* Campaign Switcher */}
      <div className="p-4 border-b border-gray-200">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">Campaign</span>
        </div>
        {loading ? (
          <div className="h-10 bg-gray-100 rounded-md animate-pulse" />
        ) : (
          <Select
            value={selectedCampaign?.id || ''}
            onValueChange={(value) => {
              const campaign = campaigns.find(c => c.id === value);
              onCampaignChange(campaign || null);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
                      <span className="font-medium">{campaign.name}</span>
                    </div>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {campaign.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          asChild
        >
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-pink-50 text-pink-700 border border-pink-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
}