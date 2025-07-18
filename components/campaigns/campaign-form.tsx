"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Campaign } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Loader2,
  Save,
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Target,
  Upload,
  Sparkles,
} from "lucide-react";

interface CampaignFormProps {
  campaign?: Campaign;
  onSave?: (campaign: Campaign) => void;
}

export function CampaignForm({ campaign, onSave }: CampaignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: campaign?.name || "",
    client: campaign?.client || "",
    description: campaign?.description || "",
    brief: campaign?.brief || "",
    startDate: campaign?.startDate?.toISOString().split("T")[0] || "",
    endDate: campaign?.endDate?.toISOString().split("T")[0] || "",
    status: campaign?.status || ("active" as const),
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!formData.client.trim()) {
      newErrors.client = "Client name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      const campaignData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      let savedCampaign: Campaign;
      if (campaign) {
        savedCampaign = (await api.updateCampaign(
          campaign.id,
          campaignData
        )) as Campaign;
      } else {
        savedCampaign = await api.createCampaign(campaignData);
      }

      onSave?.(savedCampaign);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleChange("brief", content);
    };
    reader.readAsText(file);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sampleBrief = `Campaign Brief: Smart Home Device Launch

Objective: Launch our new AI-powered home security system to tech-savvy millennials

Target Audience: 
- Age: 25-40 years old
- Demographics: Urban professionals, homeowners, tech enthusiasts
- Interests: Smart home technology, security, convenience

Key Messages:
- Innovation: Cutting-edge AI technology
- Security: Advanced protection for your home
- Ease of use: Simple setup and intuitive controls

Budget: $50,000
Timeline: 3 months (Q1 2024)

Preferred Channels:
- Social media (Instagram, YouTube, TikTok)
- Influencer partnerships
- Tech blogs and publications

Success Metrics:
- Brand awareness increase: 25%
- Lead generation: 1,000 qualified leads
- Social engagement: 50% increase

Additional Notes:
Looking for authentic reviews and product demonstrations. Focus on real-world use cases and customer testimonials.`;

  return (
    <div className="w-full">
      <Card className="shadow-lg border-0 bg-white">
        {campaign && (
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="hover:bg-white/50"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Edit Campaign
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Update your campaign details
                  </CardDescription>
                </div>
              </div>
              <Badge
                className={`${getStatusColor(campaign.status)} font-medium`}
              >
                {campaign.status.charAt(0).toUpperCase() +
                  campaign.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
        )}

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Campaign Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter campaign name"
                    className={`h-12 ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-pink-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="client"
                    className="text-sm font-medium text-gray-700"
                  >
                    Client *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => handleChange("client", e.target.value)}
                      placeholder="Enter client name"
                      className={`h-12 pl-10 ${
                        errors.client
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-pink-500"
                      }`}
                    />
                  </div>
                  {errors.client && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      {errors.client}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description *
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe your campaign objectives and target audience"
                    rows={4}
                    className={`pl-10 resize-none ${
                      errors.description
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-pink-500"
                    }`}
                  />
                </div>
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Campaign Brief Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Campaign Brief
                </h3>
                <Badge variant="secondary" className="ml-2">
                  Optional
                </Badge>
              </div>

              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <p className="text-sm text-gray-700 mb-3">
                  Add a detailed campaign brief to help our AI tools generate
                  better recommendations for influencers, content, and media
                  opportunities.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <Sparkles className="h-3 w-3" />
                    <span>Powers AI recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <FileText className="h-3 w-3" />
                    <span>Supports file upload</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="brief"
                    className="text-sm font-medium text-gray-700"
                  >
                    Campaign Brief
                  </Label>
                  <Textarea
                    id="brief"
                    value={formData.brief}
                    onChange={(e) => handleChange("brief", e.target.value)}
                    placeholder={sampleBrief}
                    rows={8}
                    className="resize-none border-gray-300 focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Label htmlFor="brief-upload" className="sr-only">
                      Upload Brief File
                    </Label>
                    <Input
                      id="brief-upload"
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("brief-upload")?.click()
                      }
                      className="w-full sm:w-auto"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Brief File
                    </Button>
                  </div>

                  {formData.brief && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleChange("brief", "")}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear Brief
                    </Button>
                  )}
                </div>

                {formData.brief && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Brief added successfully!
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your campaign brief will be used to generate AI-powered
                      recommendations across all tools.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Timeline Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Timeline
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Start Date *
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className={`h-12 ${
                      errors.startDate
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-pink-500"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    End Date *
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className={`h-12 ${
                      errors.endDate
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-pink-500"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Status Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              </div>

              <div className="max-w-md">
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
                  Campaign Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger className="h-12 mt-2 border-gray-300 focus:border-pink-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="paused">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Paused</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <span>Completed</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="px-8 py-3 h-12 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {campaign ? "Update Campaign" : "Create Campaign"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
