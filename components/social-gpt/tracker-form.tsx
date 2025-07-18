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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  MessageCircle,
  Send,
  Bot,
  User,
  Settings,
  Play,
  Clock,
  Calendar,
  Hash,
  Target,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Globe,
} from "lucide-react";
import { TikTokIcon } from "./tiktok-icon";
import { SocialTrackingAIQueryProcessor } from "@/lib/ai-query-processor";

interface TrackerFormProps {
  campaignId: string;
  tracker?: SocialTracker;
  onSave?: (tracker: SocialTracker) => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  trackingParams?: any;
}

interface AIProcessingStep {
  step: string;
  completed: boolean;
  processing: boolean;
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

  // Enhanced AI-first state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiProcessingSteps, setAiProcessingSteps] = useState<
    AIProcessingStep[]
  >([]);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [aiGeneratedParams, setAiGeneratedParams] = useState<any>(null);
  const [showManualAdjustment, setShowManualAdjustment] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<string>("");

  // Backfill state
  const [enableBackfill, setEnableBackfill] = useState(false);
  const [backfillDate, setBackfillDate] = useState("");

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

  // Initialize chat on component mount
  useState(() => {
    if (!tracker) {
      const initialMessage: ChatMessage = {
        id: "initial",
        type: "assistant",
        content:
          "Hello! I'm here to help you create a social media tracker. You can describe what you want to track in natural language, and I'll set up the tracker for you.\n\nFor example, you could say:\n• Track mentions of TechCorp on Instagram and Twitter for 30 days\n• Monitor #ProductLaunch campaign across all platforms\n• Create crisis monitoring for customer complaints\n\nWhat would you like to track?",
        timestamp: new Date(),
      };
      setChatMessages([initialMessage]);
    }
  });

  const simulateAIProcessing = async (): Promise<void> => {
    const steps: AIProcessingStep[] = [
      { step: "Analyzing your request...", completed: false, processing: true },
      {
        step: "Identifying keywords and hashtags...",
        completed: false,
        processing: false,
      },
      {
        step: "Determining platforms to monitor...",
        completed: false,
        processing: false,
      },
      {
        step: "Setting up date parameters...",
        completed: false,
        processing: false,
      },
      {
        step: "Generating tracker configuration...",
        completed: false,
        processing: false,
      },
      { step: "Finalizing setup...", completed: false, processing: false },
    ];

    setAiProcessingSteps(steps);

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      setAiProcessingSteps((prev) =>
        prev.map((step, index) => {
          if (index === i) {
            return { ...step, completed: true, processing: false };
          } else if (index === i + 1) {
            return { ...step, processing: true };
          }
          return step;
        })
      );
    }
  };

  const handleAIProcess = async (query: string) => {
    if (!query.trim()) return;

    setIsAIProcessing(true);
    setShowAIPreview(true);

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);

    try {
      // Simulate AI processing with visual feedback
      await simulateAIProcessing();

      const result = await queryProcessor.processSocialTrackingQuery(query);

      // Store AI-generated parameters
      setAiGeneratedParams(result.trackingParams);

      // Update form data
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

      // Generate AI interpretation
      const interpretation = `I've analyzed your request and created a tracker for "${
        result.trackingParams.name
      }". I'll monitor ${result.trackingParams.keywords.length} keywords${
        result.trackingParams.hashtags.length > 0
          ? ` and ${result.trackingParams.hashtags.length} hashtags`
          : ""
      } across ${result.trackingParams.platforms.length} platform${
        result.trackingParams.platforms.length > 1 ? "s" : ""
      }.`;
      setAiInterpretation(interpretation);

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Perfect! ${interpretation}\n\nHere's what I've set up:\n• **Keywords**: ${result.trackingParams.keywords.join(
          ", "
        )}\n• **Hashtags**: ${
          result.trackingParams.hashtags.join(", ") || "None"
        }\n• **Platforms**: ${result.trackingParams.platforms.join(
          ", "
        )}\n• **Duration**: ${result.trackingParams.startDate} to ${
          result.trackingParams.endDate
        }\n\nYou can review and adjust these settings below, or create the tracker as-is.`,
        timestamp: new Date(),
        trackingParams: result.trackingParams,
      };
      setChatMessages((prev) => [...prev, assistantMessage]);

      // Clear any existing errors
      setErrors({});
    } catch (error) {
      console.error("Error processing AI query:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again with a different description.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAIProcessing(false);
      setAiProcessingSteps([]);
    }
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuery.trim()) {
      handleAIProcess(aiQuery);
      setAiQuery("");
    }
  };

  const handleExampleClick = (example: string) => {
    setAiQuery(example);
    handleAIProcess(example);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAiQuery(suggestion);
    handleAIProcess(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAISubmit(e);
    }
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

    if (enableBackfill && !backfillDate) {
      newErrors.backfillDate =
        "Backfill date is required when backfill is enabled";
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
        backfill: enableBackfill ? new Date(backfillDate) : undefined,
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

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, index) => (
      <div key={index} className={index > 0 ? "mt-2" : ""}>
        {line.startsWith("• ") ? (
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{line.substring(2)}</span>
          </div>
        ) : (
          line
        )}
      </div>
    ));
  };

  // AI Preview Component
  const AIPreview = () => {
    if (!showAIPreview || !aiGeneratedParams) return null;

    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span>AI-Generated Tracker Configuration</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {Math.round(aiConfidence * 100)}% confidence
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManualAdjustment(!showManualAdjustment)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Adjust
              </Button>
            </div>
          </div>
          {aiInterpretation && (
            <CardDescription className="text-blue-700">
              {aiInterpretation}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Processing Steps */}
          {isAIProcessing && aiProcessingSteps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-blue-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is analyzing your request...</span>
              </div>
              <div className="space-y-2">
                {aiProcessingSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : step.processing ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span
                      className={
                        step.completed
                          ? "text-green-700"
                          : step.processing
                          ? "text-blue-700"
                          : "text-gray-500"
                      }
                    >
                      {step.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Generated Parameters Preview */}
          {!isAIProcessing && aiGeneratedParams && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Target className="h-4 w-4" />
                  <span>
                    Keywords ({aiGeneratedParams.keywords?.length || 0})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {aiGeneratedParams.keywords?.map(
                    (keyword: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Hash className="h-4 w-4" />
                  <span>
                    Hashtags ({aiGeneratedParams.hashtags?.length || 0})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {aiGeneratedParams.hashtags?.map(
                    (hashtag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {hashtag}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Globe className="h-4 w-4" />
                  <span>
                    Platforms ({aiGeneratedParams.platforms?.length || 0})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {aiGeneratedParams.platforms?.map(
                    (platform: string, index: number) => {
                      const platformData = platforms.find(
                        (p) => p.id === platform
                      );
                      if (!platformData) return null;
                      const Icon = platformData.icon;
                      return (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs flex items-center space-x-1"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{platformData.name}</span>
                        </Badge>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                <div className="text-sm text-gray-600">
                  {aiGeneratedParams.startDate} to {aiGeneratedParams.endDate}
                  {formData.startDate && formData.endDate && (
                    <span className="ml-2 text-blue-600">
                      ({getDurationInDays()} days)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && !isAIProcessing && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Lightbulb className="h-4 w-4" />
                <span>AI Insights</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 text-xs"
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isAIProcessing && aiGeneratedParams && (
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIPreview(false)}
              >
                Hide Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManualAdjustment(!showManualAdjustment)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Adjust Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Card */}
      <Card>
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
                <MessageCircle className="h-4 w-4" />
                <span>AI Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Manual Setup</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              {/* AI Chat Interface */}
              <Card className="bg-gray-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <span>AI Assistant</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Chat Messages */}
                  <ScrollArea className="h-64 w-full p-4 bg-white rounded-lg border">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.type === "assistant" && (
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.type === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="text-sm">
                              {formatMessage(message.content)}
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          {message.type === "user" && (
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Chat Input */}
                  <form onSubmit={handleAISubmit} className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Sparkles className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
                        <Textarea
                          value={aiQuery}
                          onChange={(e) => setAiQuery(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Describe what you want to track... (e.g., 'Track mentions of TechCorp on Instagram and Twitter for 30 days')"
                          className="pl-10 min-h-[60px] resize-none"
                          rows={2}
                          disabled={isAIProcessing}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={!aiQuery.trim() || isAIProcessing}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-4"
                      >
                        {isAIProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Quick Suggestions */}
                    {!isAIProcessing && aiSuggestions.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Quick suggestions:
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions
                            .slice(0, 3)
                            .map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleSuggestionClick(suggestion)
                                }
                                className="text-xs bg-white hover:bg-pink-50 hover:border-pink-300"
                              >
                                {suggestion}
                              </Button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Example Queries */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Try these examples:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {exampleQueries.slice(0, 4).map((example, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExampleClick(example)}
                            className="text-xs bg-gray-50 hover:bg-pink-50 hover:border-pink-300 justify-start h-auto p-3 text-left whitespace-normal"
                          >
                            {example}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              {/* Manual Setup Form */}
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-medium">Manual Setup</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Configure your tracker manually with specific parameters.
                    Fill out the form below to create your tracker.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* AI Preview */}
          <AIPreview />

          {/* Manual Configuration (Always visible when AI has generated params or in manual mode) */}
          {(showManualAdjustment ||
            inputMode === "manual" ||
            (aiGeneratedParams && showAdvanced)) && (
            <Collapsible
              open={
                showAdvanced || showManualAdjustment || inputMode === "manual"
              }
              onOpenChange={setShowAdvanced}
            >
              <CollapsibleContent className="space-y-6">
                <Separator />

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

                {/* Platform Selection */}
                <div className="space-y-4">
                  <div>
                    <Label>
                      Platforms to Monitor * ({formData.platforms.length}{" "}
                      selected)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Select which social media platforms to track
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = formData.platforms.includes(
                        platform.id
                      );

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
                              onCheckedChange={() =>
                                togglePlatform(platform.id)
                              }
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
                    <Button
                      type="button"
                      onClick={addKeyword}
                      variant="outline"
                    >
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
                    <Button
                      type="button"
                      onClick={addHashtag}
                      variant="outline"
                    >
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

                {/* Backfill Toggle and Date */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="backfill"
                      checked={enableBackfill}
                      onCheckedChange={setEnableBackfill}
                    />
                    <Label htmlFor="backfill" className="text-sm font-medium">
                      Enable Backfill
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Backfill will collect historical data from before the start
                    date
                  </p>

                  {enableBackfill && (
                    <div className="space-y-2">
                      <Label htmlFor="backfillDate">Backfill Date *</Label>
                      <Input
                        id="backfillDate"
                        type="date"
                        value={backfillDate}
                        onChange={(e) => setBackfillDate(e.target.value)}
                        className={errors.backfillDate ? "border-red-500" : ""}
                      />
                      {errors.backfillDate && (
                        <p className="text-sm text-red-500">
                          {errors.backfillDate}
                        </p>
                      )}
                    </div>
                  )}
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
          )}

          {/* Helpful message when no AI params and in AI mode */}
          {!aiGeneratedParams && inputMode === "ai" && (
            <div className="text-center py-8">
              <div className="flex flex-col items-center space-y-3 text-gray-500">
                <MessageCircle className="h-8 w-8" />
                <p className="text-sm">
                  Use the AI chat above to describe what you want to track, or
                  switch to manual setup.
                </p>
              </div>
            </div>
          )}

          {/* Submit Buttons - Only show when we have AI-generated params or in manual mode */}
          {(aiGeneratedParams || inputMode === "manual") && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
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
                disabled={loading || (!aiGeneratedParams && inputMode === "ai")}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
