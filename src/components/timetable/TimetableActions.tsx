
import React from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { Share, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TimetableActionsProps {
  generateTimetable: () => void;
  clearTimetable: () => void;
  isGenerating: boolean;
  hasData: boolean;
  hasEntries: boolean;
}

const TimetableActions: React.FC<TimetableActionsProps> = ({
  generateTimetable,
  clearTimetable,
  isGenerating,
  hasData,
  hasEntries,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <CustomButton 
        variant="default" 
        onClick={generateTimetable}
        loading={isGenerating}
        disabled={!hasData && !hasEntries}
        className="shadow-md"
      >
        <RefreshCw size={16} className="mr-2" />
        Generate
      </CustomButton>
      
      {hasEntries && (
        <>
          <CustomButton 
            variant="secondary"
            className="border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <Download size={16} className="mr-2" />
            Export
          </CustomButton>
          <CustomButton 
            variant="secondary"
            className="border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <Share size={16} className="mr-2" />
            Share
          </CustomButton>
          <CustomButton 
            variant="outline" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shadow-sm"
            onClick={clearTimetable}
          >
            Clear
          </CustomButton>
        </>
      )}
    </div>
  );
};

export default TimetableActions;
