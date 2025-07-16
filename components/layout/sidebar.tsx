"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Campaign } from "@/lib/types";
import { api } from "@/lib/mock-api";
import {
  ChevronDown,
  BarChart3,
  Zap,
  Users,
  MessageSquare,
  Plus,
  Settings,
  Building,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "PublicityGPT", href: "/publicity-gpt", icon: Zap },
    { name: "ElevateGPT", href: "/elevate-gpt", icon: Users },
    { name: "SocialGPT", href: "/social-gpt", icon: MessageSquare },
  ];

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "paused":
        return "secondary";
      case "completed":
        return "outline";
      default:
        return "secondary";
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-10 px-3 py-2"
              >
                {selectedCampaign ? (
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(
                        selectedCampaign.status
                      )}`}
                    />
                    <span className="font-medium truncate">
                      {selectedCampaign.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select campaign</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {campaigns.map((campaign) => (
                <DropdownMenuItem
                  key={campaign.id}
                  onClick={() => onCampaignChange(campaign)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(
                          campaign.status
                        )}`}
                      />
                      <span className="font-medium truncate">
                        {campaign.name}
                      </span>
                      {selectedCampaign?.id === campaign.id && (
                        <Check className="h-4 w-4 text-pink-500 flex-shrink-0" />
                      )}
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(campaign.status)}
                      className="ml-2 text-xs flex-shrink-0"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/campaigns/new" className="cursor-pointer">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
                  ? "bg-pink-50 text-pink-700 border border-pink-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
