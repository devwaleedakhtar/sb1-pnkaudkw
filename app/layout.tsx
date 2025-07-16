'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { Campaign } from '@/lib/types';
import { Sidebar } from '@/components/layout/sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar 
            selectedCampaign={selectedCampaign} 
            onCampaignChange={setSelectedCampaign}
          />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}