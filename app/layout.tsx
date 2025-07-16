"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useState } from "react";
import { Campaign } from "@/lib/types";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="flex h-full bg-gray-50">
          <Sidebar
            selectedCampaign={selectedCampaign}
            onCampaignChange={setSelectedCampaign}
          />
          <main className="flex-1 overflow-auto">
            <div className="min-h-full p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
