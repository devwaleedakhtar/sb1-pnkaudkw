"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Bell,
  Shield,
  Palette,
  User,
  Zap,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  CreditCard,
  Settings as SettingsIcon,
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    mediaAlerts: true,
    influencerUpdates: true,
    weeklyReports: false,
    campaignUpdates: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: false,
    language: "en",
    timezone: "UTC",
    currency: "USD",
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "preferences",
      title: "Preferences",
      icon: Palette,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "ai",
      title: "AI Settings",
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and AI-powered features"
      >
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </PageHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm h-12">
          {settingsSections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex items-center space-x-2"
            >
              <section.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-pink-500" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="bg-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Your Agency"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Marketing Manager</SelectItem>
                      <SelectItem value="director">
                        Marketing Director
                      </SelectItem>
                      <SelectItem value="coordinator">
                        Campaign Coordinator
                      </SelectItem>
                      <SelectItem value="analyst">Marketing Analyst</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  className="bg-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Receive updates via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <div>
                      <Label htmlFor="pushNotifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Receive push notifications on your device
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("push", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="mediaAlerts">Media Coverage Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Get notified about new media coverage
                    </p>
                  </div>
                  <Switch
                    id="mediaAlerts"
                    checked={notifications.mediaAlerts}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("mediaAlerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="influencerUpdates">
                      Influencer Updates
                    </Label>
                    <p className="text-sm text-gray-600">
                      Updates on influencer activities and opportunities
                    </p>
                  </div>
                  <Switch
                    id="influencerUpdates"
                    checked={notifications.influencerUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("influencerUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="campaignUpdates">Campaign Updates</Label>
                    <p className="text-sm text-gray-600">
                      Notifications about campaign performance and changes
                    </p>
                  </div>
                  <Switch
                    id="campaignUpdates"
                    checked={notifications.campaignUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("campaignUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-gray-600">
                      Receive weekly performance summaries
                    </p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("weeklyReports", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <span>Appearance & Preferences</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-gray-600">
                      Switch to dark theme
                    </p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("darkMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                  <div>
                    <Label htmlFor="compactView">Compact View</Label>
                    <p className="text-sm text-gray-600">
                      Reduce spacing and padding
                    </p>
                  </div>
                  <Switch
                    id="compactView"
                    checked={preferences.compactView}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("compactView", checked)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      handlePreferenceChange("language", value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      handlePreferenceChange("timezone", value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      handlePreferenceChange("currency", value)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-green-500" />
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3 mb-3">
                    <Key className="h-5 w-5 text-green-500" />
                    <div>
                      <Label>Change Password</Label>
                      <p className="text-sm text-gray-600">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="bg-white"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-white"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-white"
                    />
                    <Button className="w-full">Update Password</Button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3 mb-3">
                    <Database className="h-5 w-5 text-green-500" />
                    <div>
                      <Label>Data Export</Label>
                      <p className="text-sm text-gray-600">
                        Download your data and campaign information
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span>AI-Powered Features</span>
              </CardTitle>
              <CardDescription>
                Configure AI settings and preferences for enhanced marketing
                insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label>AI Recommendations</Label>
                      <p className="text-sm text-gray-600">
                        Get AI-powered suggestions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label>Smart Insights</Label>
                      <p className="text-sm text-gray-600">
                        Automated performance insights
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label>Auto-Generated Reports</Label>
                      <p className="text-sm text-gray-600">
                        AI-created campaign summaries
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Label>Predictive Analytics</Label>
                      <p className="text-sm text-gray-600">
                        Forecast campaign performance
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <Label className="mb-3 block">AI Model Preferences</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creative">Creative Focus</SelectItem>
                    <SelectItem value="balanced">Balanced Approach</SelectItem>
                    <SelectItem value="analytical">Analytical Focus</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
