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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, User, Key } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and profile information"
      >
        <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </PageHeader>

      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-pink-500" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal information, profile settings, and account
            security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" className="bg-white" />
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
                  <SelectItem value="director">Marketing Director</SelectItem>
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

          <Separator className="my-6" />

          <div className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
