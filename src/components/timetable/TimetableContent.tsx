
import React from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import TimetableViewSelector from "@/components/timetable/TimetableViewSelector";
import CalendarView from "@/components/timetable/CalendarView";
import GoogleCalendarView from "@/components/timetable/GoogleCalendarView";
import { TimetableEntry } from "@/types";

interface TimetableContentProps {
  timetableEntries: TimetableEntry[];
  viewMode: "grid" | "calendar" | "google";
  setViewMode: (mode: "grid" | "calendar" | "google") => void;
  date: Date;
  setDate: (date: Date) => void;
}

const TimetableContent: React.FC<TimetableContentProps> = ({
  timetableEntries,
  viewMode,
  setViewMode,
  date,
  setDate,
}) => {
  return (
    <div className="animate-fade-in">
      <GlassCard className="mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Current Timetable</h2>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Last generated: {new Date().toLocaleDateString()}
              </p>
              
              <TimetableViewSelector 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="overflow-auto">
            <Tabs value={viewMode}>
              <TabsContent value="grid" className="m-0">
                <TimetableGrid entries={timetableEntries} />
              </TabsContent>
              
              <TabsContent value="calendar" className="m-0">
                <CalendarView 
                  date={date}
                  setDate={setDate}
                  timetableEntries={timetableEntries}
                />
              </TabsContent>
              
              <TabsContent value="google" className="m-0">
                <GoogleCalendarView />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </GlassCard>
      
      <div className="flex justify-end">
        <CustomButton 
          variant="secondary" 
          size="sm" 
          className="border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          Print Timetable
        </CustomButton>
      </div>
    </div>
  );
};

export default TimetableContent;
