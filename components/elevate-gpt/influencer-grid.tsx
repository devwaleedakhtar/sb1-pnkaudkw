"use client";

import { useState } from "react";
import { Influencer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Star,
  CheckCircle,
  Heart,
  Download,
  Plus,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  Eye,
  Mail,
  ExternalLink,
} from "lucide-react";

interface InfluencerGridProps {
  influencers: Influencer[];
  loading?: boolean;
  onExportShortlist: (shortlisted: Influencer[]) => void;
}

type SortOption = "followers" | "engagement" | "name" | "platform";
type SortDirection = "asc" | "desc";

export function InfluencerGrid({
  influencers,
  loading,
  onExportShortlist,
}: InfluencerGridProps) {
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("followers");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toggleShortlist = (influencerId: string) => {
    const newShortlisted = new Set(shortlisted);
    if (newShortlisted.has(influencerId)) {
      newShortlisted.delete(influencerId);
    } else {
      newShortlisted.add(influencerId);
    }
    setShortlisted(newShortlisted);
  };

  const handleExportShortlist = () => {
    const shortlistedInfluencers = influencers.filter((inf) =>
      shortlisted.has(inf.id)
    );
    onExportShortlist(shortlistedInfluencers);
  };

  const sortInfluencers = (influencers: Influencer[]): Influencer[] => {
    return [...influencers].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "followers":
          aValue = a.followers;
          bValue = b.followers;
          break;
        case "engagement":
          aValue = a.engagement;
          bValue = b.engagement;
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "platform":
          aValue = a.platform;
          bValue = b.platform;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const filterInfluencers = (influencers: Influencer[]): Influencer[] => {
    return influencers.filter((inf) => {
      const matchesSearch =
        inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform =
        filterPlatform === "all" || inf.platform === filterPlatform;
      const matchesCategory =
        filterCategory === "all" ||
        inf.category.toLowerCase().includes(filterCategory.toLowerCase());

      return matchesSearch && matchesPlatform && matchesCategory;
    });
  };

  const processedInfluencers = sortInfluencers(filterInfluencers(influencers));

  const getPlatformColor = (platform: Influencer["platform"]) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-pink-500 to-purple-600 text-white";
      case "twitter":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case "tiktok":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "youtube":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: "bg-blue-100 text-blue-800",
      lifestyle: "bg-green-100 text-green-800",
      fashion: "bg-pink-100 text-pink-800",
      fitness: "bg-orange-100 text-orange-800",
      food: "bg-yellow-100 text-yellow-800",
      travel: "bg-purple-100 text-purple-800",
      beauty: "bg-rose-100 text-rose-800",
      gaming: "bg-indigo-100 text-indigo-800",
    };
    return (
      colors[category.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const formatFollowers = (followers: number) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  const getEngagementLevel = (engagement: number) => {
    if (engagement >= 5) return { level: "Excellent", color: "text-green-600" };
    if (engagement >= 3) return { level: "Good", color: "text-blue-600" };
    if (engagement >= 1) return { level: "Average", color: "text-yellow-600" };
    return { level: "Low", color: "text-red-600" };
  };

  const platforms = [
    { value: "all", label: "All Platforms" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food & Cooking" },
    { value: "travel", label: "Travel" },
    { value: "beauty", label: "Beauty" },
    { value: "gaming", label: "Gaming" },
  ];

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Search Results</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">
            Search Results ({processedInfluencers.length})
          </h3>
          {shortlisted.size > 0 && (
            <Badge variant="secondary" className="bg-pink-100 text-pink-800">
              {shortlisted.size} selected
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>

          {shortlisted.size > 0 && (
            <Button
              onClick={handleExportShortlist}
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 border-green-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Shortlist
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search influencers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((platform) => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="followers">Followers</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="platform">Platform</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
          className="flex items-center space-x-2"
        >
          {sortDirection === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
          <span>{sortDirection === "asc" ? "Ascending" : "Descending"}</span>
        </Button>
      </div>

      {/* Results */}
      {processedInfluencers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Influencers Found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {processedInfluencers.map((influencer) => {
            const engagementInfo = getEngagementLevel(influencer.engagement);

            return viewMode === "grid" ? (
              <Card
                key={influencer.id}
                className="hover:shadow-lg transition-all duration-200 relative group border-l-4 border-l-pink-500"
              >
                <div className="absolute top-4 right-4 z-10">
                  <Checkbox
                    checked={shortlisted.has(influencer.id)}
                    onCheckedChange={() => toggleShortlist(influencer.id)}
                    className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  />
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-14 w-14 ring-2 ring-pink-100">
                      <AvatarImage
                        src={influencer.avatar}
                        alt={influencer.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        {influencer.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg truncate">
                          {influencer.name}
                        </CardTitle>
                        {influencer.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          className={getPlatformColor(influencer.platform)}
                        >
                          {influencer.platform}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(influencer.category)}
                        >
                          {influencer.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Followers</span>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="font-semibold text-sm">
                            {formatFollowers(influencer.followers)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Engagement
                        </span>
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 text-pink-500 mr-1" />
                          <span
                            className={`font-semibold text-sm ${engagementInfo.color}`}
                          >
                            {influencer.engagement}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quality</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${engagementInfo.color}`}
                      >
                        {engagementInfo.level}
                      </Badge>
                    </div>

                    {/* Worked with us indicator - only show when internal DB is enabled */}
                    {influencer.hasWorkedWithUs && (
                      <div className="flex items-center gap-1 pt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-800"
                        >
                          ✓ Worked with us before
                        </Badge>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card
                key={influencer.id}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={shortlisted.has(influencer.id)}
                      onCheckedChange={() => toggleShortlist(influencer.id)}
                      className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                    />

                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={influencer.avatar}
                        alt={influencer.name}
                      />
                      <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold truncate">
                          {influencer.name}
                        </h4>
                        {influencer.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          className={getPlatformColor(influencer.platform)}
                        >
                          {influencer.platform}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(influencer.category)}
                        >
                          {influencer.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">
                          {formatFollowers(influencer.followers)}
                        </div>
                        <div className="text-gray-600">Followers</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`font-semibold ${engagementInfo.color}`}
                        >
                          {influencer.engagement}%
                        </div>
                        <div className="text-gray-600">Engagement</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
