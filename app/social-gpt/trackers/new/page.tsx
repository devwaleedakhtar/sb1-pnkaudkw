'use client';

import { TrackerForm } from '@/components/social-gpt/tracker-form';
import { PageHeader } from '@/components/layout/page-header';

export default function NewTracker() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Create Social Tracker"
        description="Set up social media monitoring for your campaign"
      />
      <TrackerForm campaignId="1" />
    </div>
  );
}