"use client";

import { CampaignForm } from "@/components/campaigns/campaign-form";
import { PageHeader } from "@/components/layout/page-header";

export default function NewCampaign() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Campaign"
        description="Set up a new marketing campaign with AI-powered tools"
      />
      <CampaignForm />
    </div>
  );
}
