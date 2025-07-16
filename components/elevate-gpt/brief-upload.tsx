"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Wand2,
  FileText,
  Sparkles,
  Copy,
  CheckCircle,
} from "lucide-react";
import { InfluencerAIQueryProcessor } from "@/lib/ai-query-processor";

interface BriefUploadProps {
  onGenerateQueries: (brief: string, queries: string[]) => void;
  onSearchQuery: (query: string) => void;
  loading?: boolean;
}

interface CampaignBrief {
  campaign: string;
  targetAudience: string;
  product: string;
  budget: string;
  timeline: string;
  platforms: string[];
  keyMessages: string[];
  additionalNotes: string;
}

export function BriefUpload({
  onGenerateQueries,
  onSearchQuery,
  loading,
}: BriefUploadProps) {
  const [brief, setBrief] = useState("");
  const [structuredBrief, setStructuredBrief] = useState<CampaignBrief>({
    campaign: "",
    targetAudience: "",
    product: "",
    budget: "",
    timeline: "",
    platforms: [],
    keyMessages: [],
    additionalNotes: "",
  });
  const [generatedQueries, setGeneratedQueries] = useState<string[]>([]);
  const [useStructured, setUseStructured] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [queryProcessor] = useState(() => new InfluencerAIQueryProcessor());

  const handleGenerateQueries = async () => {
    const briefText = useStructured ? generateBriefFromStructured() : brief;
    if (!briefText.trim()) return;

    // Generate AI-powered search queries based on the brief
    const queries = await generateIntelligentQueries(briefText);
    setGeneratedQueries(queries);
    onGenerateQueries(briefText, queries);
  };

  const generateBriefFromStructured = (): string => {
    const parts = [];
    if (structuredBrief.campaign)
      parts.push(`Campaign: ${structuredBrief.campaign}`);
    if (structuredBrief.targetAudience)
      parts.push(`Target Audience: ${structuredBrief.targetAudience}`);
    if (structuredBrief.product)
      parts.push(`Product: ${structuredBrief.product}`);
    if (structuredBrief.budget) parts.push(`Budget: ${structuredBrief.budget}`);
    if (structuredBrief.timeline)
      parts.push(`Timeline: ${structuredBrief.timeline}`);
    if (structuredBrief.platforms.length > 0)
      parts.push(`Platforms: ${structuredBrief.platforms.join(", ")}`);
    if (structuredBrief.keyMessages.length > 0)
      parts.push(`Key Messages: ${structuredBrief.keyMessages.join(", ")}`);
    if (structuredBrief.additionalNotes)
      parts.push(`Additional Notes: ${structuredBrief.additionalNotes}`);

    return parts.join("\n");
  };

  const generateIntelligentQueries = async (
    briefText: string
  ): Promise<string[]> => {
    const queries: string[] = [];
    const lowerBrief = briefText.toLowerCase();

    // Extract key information from brief
    const platforms = extractPlatforms(lowerBrief);
    const categories = extractCategories(lowerBrief);
    const audienceSize = extractAudienceSize(lowerBrief);
    const demographics = extractDemographics(lowerBrief);
    const engagement = extractEngagementRequirements(lowerBrief);

    // Generate targeted queries
    platforms.forEach((platform) => {
      categories.forEach((category) => {
        let query = `${category} influencers on ${platform}`;

        if (audienceSize) query += ` with ${audienceSize}`;
        if (demographics) query += ` targeting ${demographics}`;
        if (engagement) query += ` with ${engagement}`;

        queries.push(query);
      });
    });

    // Add broader queries
    if (categories.length > 0) {
      queries.push(`${categories[0]} micro-influencers with high engagement`);
      queries.push(`verified ${categories[0]} creators`);
    }

    // Add demographic-specific queries
    if (demographics) {
      queries.push(`influencers targeting ${demographics}`);
    }

    // Fallback queries if nothing specific found
    if (queries.length === 0) {
      queries.push("lifestyle influencers with good engagement");
      queries.push("micro-influencers in technology niche");
      queries.push("verified creators with over 50k followers");
    }

    return queries.slice(0, 8); // Limit to 8 queries
  };

  const extractPlatforms = (text: string): string[] => {
    const platforms = [];
    if (text.includes("instagram") || text.includes("ig"))
      platforms.push("Instagram");
    if (text.includes("youtube") || text.includes("yt"))
      platforms.push("YouTube");
    if (text.includes("tiktok") || text.includes("tik tok"))
      platforms.push("TikTok");
    if (text.includes("twitter") || text.includes("x.com"))
      platforms.push("Twitter");

    return platforms.length > 0 ? platforms : ["Instagram", "YouTube"];
  };

  const extractCategories = (text: string): string[] => {
    const categories = [];
    if (text.includes("tech") || text.includes("technology"))
      categories.push("tech");
    if (text.includes("fashion") || text.includes("style"))
      categories.push("fashion");
    if (text.includes("fitness") || text.includes("health"))
      categories.push("fitness");
    if (text.includes("beauty") || text.includes("makeup"))
      categories.push("beauty");
    if (text.includes("food") || text.includes("cooking"))
      categories.push("food");
    if (text.includes("travel") || text.includes("adventure"))
      categories.push("travel");
    if (text.includes("gaming") || text.includes("esports"))
      categories.push("gaming");
    if (text.includes("lifestyle") || text.includes("life"))
      categories.push("lifestyle");

    return categories.length > 0 ? categories : ["lifestyle"];
  };

  const extractAudienceSize = (text: string): string | null => {
    if (text.includes("micro") || text.includes("small"))
      return "10k-100k followers";
    if (text.includes("macro") || text.includes("medium"))
      return "100k-1m followers";
    if (text.includes("mega") || text.includes("large"))
      return "over 1m followers";
    if (text.match(/\d+k/)) return text.match(/\d+k/)?.[0] + " followers";
    if (text.match(/\d+m/)) return text.match(/\d+m/)?.[0] + " followers";

    return null;
  };

  const extractDemographics = (text: string): string | null => {
    const demographics = [];
    if (text.includes("millennial")) demographics.push("millennials");
    if (text.includes("gen z") || text.includes("gen-z"))
      demographics.push("Gen Z");
    if (text.includes("teen") || text.includes("young"))
      demographics.push("young adults");
    if (text.includes("professional") || text.includes("business"))
      demographics.push("professionals");
    if (text.includes("parent") || text.includes("family"))
      demographics.push("parents");

    return demographics.length > 0 ? demographics.join(" and ") : null;
  };

  const extractEngagementRequirements = (text: string): string | null => {
    if (text.includes("high engagement") || text.includes("engaged audience"))
      return "high engagement";
    if (text.includes("viral") || text.includes("trending"))
      return "viral potential";
    if (text.includes("authentic") || text.includes("genuine"))
      return "authentic engagement";

    return null;
  };

  const handleCopyQuery = async (query: string) => {
    await navigator.clipboard.writeText(query);
    setCopiedQuery(query);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const handleSearchQuery = (query: string) => {
    onSearchQuery(query);
  };

  const updateStructuredField = (field: keyof CampaignBrief, value: any) => {
    setStructuredBrief((prev) => ({ ...prev, [field]: value }));
  };

  const sampleBrief = `Campaign: Smart Home Device Launch
Target Audience: Tech-savvy millennials aged 25-40
Product: AI-powered home security system
Key Messages: Innovation, security, ease of use
Budget: $50,000
Timeline: 3 months
Preferred Platforms: Instagram, YouTube, TikTok
Additional Notes: Looking for authentic reviews and demonstrations`;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Campaign Brief & Query Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brief Input Mode Toggle */}
        <div className="flex items-center space-x-4">
          <Button
            variant={!useStructured ? "default" : "outline"}
            size="sm"
            onClick={() => setUseStructured(false)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Free Text
          </Button>
          <Button
            variant={useStructured ? "default" : "outline"}
            size="sm"
            onClick={() => setUseStructured(true)}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Structured Form
          </Button>
        </div>

        {/* Brief Input */}
        {!useStructured ? (
          <div>
            <Label htmlFor="brief">Campaign Brief</Label>
            <Textarea
              id="brief"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder={sampleBrief}
              rows={8}
              className="mt-2"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaign">Campaign Name</Label>
              <Input
                id="campaign"
                value={structuredBrief.campaign}
                onChange={(e) =>
                  updateStructuredField("campaign", e.target.value)
                }
                placeholder="Smart Home Device Launch"
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={structuredBrief.targetAudience}
                onChange={(e) =>
                  updateStructuredField("targetAudience", e.target.value)
                }
                placeholder="Tech-savvy millennials aged 25-40"
              />
            </div>
            <div>
              <Label htmlFor="product">Product/Service</Label>
              <Input
                id="product"
                value={structuredBrief.product}
                onChange={(e) =>
                  updateStructuredField("product", e.target.value)
                }
                placeholder="AI-powered home security system"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={structuredBrief.budget}
                onChange={(e) =>
                  updateStructuredField("budget", e.target.value)
                }
                placeholder="$50,000"
              />
            </div>
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={structuredBrief.timeline}
                onChange={(e) =>
                  updateStructuredField("timeline", e.target.value)
                }
                placeholder="3 months"
              />
            </div>
            <div>
              <Label htmlFor="platforms">Preferred Platforms</Label>
              <Select
                value={structuredBrief.platforms[0] || ""}
                onValueChange={(value) =>
                  updateStructuredField("platforms", [value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={structuredBrief.additionalNotes}
                onChange={(e) =>
                  updateStructuredField("additionalNotes", e.target.value)
                }
                placeholder="Looking for authentic reviews and demonstrations"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleGenerateQueries}
            disabled={(!brief.trim() && !structuredBrief.campaign) || loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Generating..." : "Generate AI Search Queries"}
          </Button>

          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>

        {/* Generated Queries */}
        {generatedQueries.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
            <h4 className="font-medium text-pink-900 mb-3 flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>AI-Generated Search Queries</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedQueries.map((query, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-pink-200 hover:border-pink-300 transition-colors"
                >
                  <span className="text-sm text-gray-700 flex-1">{query}</span>
                  <div className="flex items-center space-x-2 ml-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyQuery(query)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedQuery === query ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSearchQuery(query)}
                      className="h-8 px-3 bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
