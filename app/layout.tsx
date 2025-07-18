"use client";

import "./globals.css";
import { Poppins } from "next/font/google";
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Campaign } from "@/lib/types";
import { Sidebar } from "@/components/layout/sidebar";
import { api } from "@/lib/mock-api";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Create Campaign Context
interface CampaignContextType {
  selectedCampaign: Campaign | null;
  setSelectedCampaign: (campaign: Campaign | null) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  // Load and select the first campaign by default
  useEffect(() => {
    const loadDefaultCampaign = async () => {
      try {
        const campaigns = await api.getCampaigns();
        if (campaigns.length > 0 && !selectedCampaign) {
          setSelectedCampaign(campaigns[0]);
        }
      } catch (error) {
        console.error("Error loading default campaign:", error);
      }
    };

    loadDefaultCampaign();
  }, [selectedCampaign]);

  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} h-full`}>
        <CampaignContext.Provider
          value={{ selectedCampaign, setSelectedCampaign }}
        >
          <div className="flex h-full bg-gray-50">
            <Sidebar
              selectedCampaign={selectedCampaign}
              onCampaignChange={setSelectedCampaign}
            />
            <main className="flex-1 overflow-auto">
              <div className="min-h-full p-8">{children}</div>
            </main>
          </div>
        </CampaignContext.Provider>
      </body>
    </html>
  );
}
