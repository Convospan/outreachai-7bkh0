'use client';

import type React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export interface ProspectStage {
  id: string;
  name: string;
  icon?: React.ReactNode; // Optional icon for the stage
}

interface ProspectJourneyVisualizerProps {
  stages: ProspectStage[];
  currentStageId: string;
  className?: string;
}

const ProspectJourneyVisualizer: React.FC<ProspectJourneyVisualizerProps> = ({
  stages,
  currentStageId,
  className,
}) => {
  const currentStageIndex = stages.findIndex(stage => stage.id === currentStageId);

  return (
    <div className={cn("flex items-center justify-between w-full overflow-x-auto py-4", className)}>
      {stages.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isActive = index === currentStageIndex;

        return (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center text-center mx-2 min-w-[100px]">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300",
                  isActive ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" :
                  isCompleted ? "bg-green-500 border-green-500 text-white" :
                  "bg-muted border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : stage.icon || index + 1}
              </div>
              <p
                className={cn(
                  "text-xs font-medium break-words",
                  isActive ? "text-primary font-semibold" :
                  isCompleted ? "text-green-600" :
                  "text-muted-foreground"
                )}
              >
                {stage.name}
              </p>
            </div>
            {index < stages.length - 1 && (
              <div className={cn(
                "flex-1 h-1 rounded transition-colors duration-500 ease-in-out",
                index < currentStageIndex ? "bg-green-500" : "bg-border"
                )} style={{ minWidth: '20px' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProspectJourneyVisualizer;
