'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Wand2, FileText } from 'lucide-react';

interface BriefUploadProps {
  onGenerateQueries: (brief: string) => void;
  loading?: boolean;
}

export function BriefUpload({ onGenerateQueries, loading }: BriefUploadProps) {
  const [brief, setBrief] = useState('');
  const [generatedQueries, setGeneratedQueries] = useState<string[]>([]);

  const handleGenerateQueries = () => {
    if (brief.trim()) {
      // Simulate AI-generated search queries based on the brief
      const queries = [
        'tech lifestyle influencers',
        'smart home content creators',
        'millennial tech reviewers',
        'home automation enthusiasts',
        'IoT device reviewers'
      ];
      setGeneratedQueries(queries);
      onGenerateQueries(brief.trim());
    }
  };

  const sampleBrief = `Campaign: Smart Home Device Launch
Target Audience: Tech-savvy millennials aged 25-40
Product: AI-powered home security system
Key Messages: Innovation, security, ease of use
Budget: $50,000
Timeline: 3 months
Preferred Platforms: Instagram, YouTube, TikTok`;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Campaign Brief</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="brief">Upload or paste your campaign brief</Label>
          <Textarea
            id="brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder={sampleBrief}
            rows={8}
            className="mt-2"
          />
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleGenerateQueries}
            disabled={!brief.trim() || loading}
            className="bg-pink-500 hover:bg-pink-600"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Search Queries'}
          </Button>
          
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        </div>

        {generatedQueries.length > 0 && (
          <div className="mt-4 p-4 bg-pink-50 rounded-lg">
            <h4 className="font-medium text-pink-900 mb-2">Generated Search Queries:</h4>
            <div className="flex flex-wrap gap-2">
              {generatedQueries.map((query, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                >
                  {query}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}