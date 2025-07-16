"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SocialTracker } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Loader2,
  Save,
  ArrowLeft,
  Plus,
  X,
  Instagram,
  Twitter,
  Youtube,
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { TikTokIcon } from "./tiktok-icon";
import { SocialTrackingAIQueryProcessor } from "@/lib/ai-query-processor";

interface TrackerFormProps {
  campaignId: string;
  tracker?: SocialTracker;
  onSave?: (tracker: SocialTracker) => void;
}

export function TrackerForm({ campaignId, tracker, onSave }: TrackerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [aiQuery, setAiQuery] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputMode, setInputMode] = useState<"ai" | "manual">("ai");
  const [queryProcessor] = useState(() => new SocialTrackingAIQueryProcessor());
  const [exampleQueries] = useState(() =>
    queryProcessor.getSocialTrackingExampleQueries()
  );

  const [formData, setFormData] = useState({
    name: tracker?.name || "",
    keywords: tracker?.keywords || [],
    hashtags: tracker?.hashtags || [],
    platforms:
      tracker?.platforms ||
      ([] as ("instagram" | "twitter" | "tiktok" | "youtube")[]),
    startDate: tracker?.startDate?.toISOString().split("T")[0] || "",
    endDate: tracker?.endDate?.toISOString().split("T")[0] || "",
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
      bgColor: "bg-pink-50 border-pink-200",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: TikTokIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200",
    },
  ] as const;

  const handleAIProcess = async (query: string) => {
    if (!query.trim()) return;

    try {
      const result = await queryProcessor.processSocialTrackingQuery(query);

      setFormData({
        name: result.trackingParams.name,
        keywords: result.trackingParams.keywords,
        hashtags: result.trackingParams.hashtags,
        platforms: result.trackingParams.platforms,
        startDate: result.trackingParams.startDate,
        endDate: result.trackingParams.endDate,
      });

      setAiSuggestions(result.suggestions);
      setAiConfidence(result.confidence);

      // Clear any existing errors
      setErrors({});
    } catch (error) {
      console.error("Error processing AI query:", error);
    }
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAIProcess(aiQuery);
  };

  const handleExampleClick = (example: string) => {
    setAiQuery(example);
    handleAIProcess(example);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tracker name is required";
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = "At least one keyword is required";
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = "At least one platform must be selected";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const trackerData = {
        campaignId,
        name: formData.name,
        keywords: formData.keywords,
        hashtags: formData.hashtags,
        platforms: formData.platforms,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        status: "active" as const,
      };

      let savedTracker: SocialTracker;
      if (tracker) {
        savedTracker = (await api.updateSocialTracker(
          tracker.id,
          trackerData
        )) as SocialTracker;
      } else {
        savedTracker = await api.createSocialTracker(trackerData);
      }

      onSave?.(savedTracker);
      router.push("/social-gpt");
    } catch (error) {
      console.error("Error saving tracker:", error);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (
      keywordInput.trim() &&
      !formData.keywords.includes(keywordInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()],
      }));
      setKeywordInput("");
      if (errors.keywords) {
        setErrors((prev) => ({ ...prev, keywords: "" }));
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  };

  const addHashtag = () => {
    const hashtag = hashtagInput.trim().startsWith("#")
      ? hashtagInput.trim()
      : `#${hashtagInput.trim()}`;

    if (hashtag !== "#" && !formData.hashtags.includes(hashtag)) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag],
      }));
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((h) => h !== hashtag),
    }));
  };

  const togglePlatform = (platformId: string) => {
    const platform = platformId as
      | "instagram"
      | "twitter"
      | "tiktok"
      | "youtube";
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
    if (errors.platforms) {
      setErrors((prev) => ({ ...prev, platforms: "" }));
    }
  };

  const getDurationInDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span>
                {tracker
                  ? "Edit Social Tracker"
                  : "Create AI-Powered Social Tracker"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Advanced
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {tracker
            ? "Update your social media tracking settings"
            : "Describe what you want to track in natural language, and AI will set up your tracker automatically"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={inputMode}
          onValueChange={(value) => setInputMode(value as "ai" | "manual")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>AI Setup</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Manual Setup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <form onSubmit={handleAISubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-400" />
                  <Textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Describe what you want to track... (e.g., 'Track mentions of TechCorp on Instagram and Twitter for 30 days')"
                    className="pl-10 min-h-[80px] resize-none"
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!aiQuery.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-pink-900 flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>AI Interpretation</span>
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-pink-100 text-pink-800"
                    >
                      {Math.round(aiConfidence * 100)}% confidence
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-white border-pink-200 text-pink-800"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Queries */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Try these examples:
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {exampleQueries.slice(0, 6).map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs bg-gray-50 hover:bg-pink-50 hover:border-pink-300 justify-start h-auto p-3"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tracker Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Tracker Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter tracker name (e.g., Brand Mentions, Product Launch)"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            </form>
          </TabsContent>
        </Tabs>

        {/* Generated/Manual Configuration */}
        <div className="space-y-6">
          {/* Tracker Name (Always visible) */}
          <div className="space-y-2">
            <Label htmlFor="name">Tracker Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter tracker name (e.g., Brand Mentions, Product Launch)"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-4">
            <div>
              <Label>
                Platforms to Monitor * ({formData.platforms.length} selected)
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select which social media platforms to track
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);

                return (
                  <div
                    key={platform.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? `${platform.bgColor} border-current`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Icon
                        className={`h-8 w-8 ${
                          isSelected ? platform.color : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? platform.color : "text-gray-700"
                        }`}
                      >
                        {platform.name}
                      </span>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => togglePlatform(platform.id)}
                        className="pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.platforms && (
              <p className="text-sm text-red-500">{errors.platforms}</p>
            )}
          </div>

          {/* Advanced Configuration */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleContent className="space-y-6">
              <Separator />

              {/* Keywords */}
              <div className="space-y-2">
                <Label>
                  Keywords to Track * ({formData.keywords.length} keywords)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Enter keyword or phrase"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addKeyword())
                    }
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() => removeKeyword(keyword)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.keywords && (
                  <p className="text-sm text-red-500">{errors.keywords}</p>
                )}
              </div>

              {/* Hashtags */}
              <div className="space-y-2">
                <Label>
                  Hashtags to Monitor ({formData.hashtags.length} hashtags)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    placeholder="Enter hashtag (with or without #)"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addHashtag())
                    }
                  />
                  <Button type="button" onClick={addHashtag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.hashtags.map((hashtag) => (
                      <Badge
                        key={hashtag}
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <span>{hashtag}</span>
                        <button
                          type="button"
                          onClick={() => removeHashtag(hashtag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Duration Info */}
              {formData.startDate && formData.endDate && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Duration:</strong> {getDurationInDays()} days
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {tracker ? "Update Tracker" : "Create Tracker"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
