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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampaignSwitcherModal } from "./campaign-switcher-modal";

interface SidebarProps {
  selectedCampaign: Campaign | null;
  onCampaignChange: (campaign: Campaign | null) => void;
}

export function Sidebar({ selectedCampaign, onCampaignChange }: SidebarProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Publicity", href: "/publicity-gpt", icon: Zap },
    { name: "Elevate", href: "/elevate-gpt", icon: Users },
    { name: "Social", href: "/social-gpt", icon: MessageSquare },
  ];

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
        <Button
          variant="outline"
          className="w-full justify-between h-10 px-3 py-2"
          onClick={() => setIsModalOpen(true)}
        >
          {selectedCampaign ? (
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  selectedCampaign.status === "active"
                    ? "bg-green-500"
                    : selectedCampaign.status === "paused"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
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

      {/* Campaign Switcher Modal */}
      <CampaignSwitcherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCampaign={selectedCampaign}
        onCampaignChange={onCampaignChange}
      />
    </div>
  );
}
