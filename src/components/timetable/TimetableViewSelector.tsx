
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, Calendar as CalendarIcon, ExternalLink } from "lucide-react";

interface TimetableViewSelectorProps {
  viewMode: "grid" | "calendar" | "google";
  setViewMode: (mode: "grid" | "calendar" | "google") => void;
}

const TimetableViewSelector: React.FC<TimetableViewSelectorProps> = ({
  viewMode,
  setViewMode,
}) => {
  return (
    <Tabs 
      value={viewMode} 
      onValueChange={(value) => setViewMode(value as "grid" | "calendar" | "google")}
      className="ml-2"
    >
      <TabsList className="h-9">
        <TabsTrigger value="grid" className="text-xs px-3">
          <CalendarClock size={16} className="mr-2" />
          Grid View
        </TabsTrigger>
        <TabsTrigger value="calendar" className="text-xs px-3">
          <CalendarIcon size={16} className="mr-2" />
          Calendar View
        </TabsTrigger>
        <TabsTrigger value="google" className="text-xs px-3">
          <ExternalLink size={16} className="mr-2" />
          Google Calendar
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TimetableViewSelector;
