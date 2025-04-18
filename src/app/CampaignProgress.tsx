import React from 'react';

export default function CampaignProgress({ progress = 0.75 }) {
  return (
    <div className="px-4 py-6 w-full max-w-2xl mx-auto">
      <p className="text-base text-foreground mb-2">Campaign Progress</p>
      <div className="w-full bg-background rounded-full h-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#F59E0B] to-[#10B981] rounded-full"
          style={{ width: `${progress * 100}%`, transition: 'width 0.3s ease-in-out' }}
        />
      </div>
      <p className="text-lg font-semibold text-[#10B981] mt-2">{Math.round(progress * 100)}%</p>
    </div>
  );
}
