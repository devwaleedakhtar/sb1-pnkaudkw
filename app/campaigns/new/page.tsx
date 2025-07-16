"use client";

import { CampaignForm } from "@/components/campaigns/campaign-form";
import { PageHeader } from "@/components/layout/page-header";

export default function NewCampaign() {
  return (
    <div className="max-w-4xl mx-auto">
      <CampaignForm />
    </div>
  );
}
