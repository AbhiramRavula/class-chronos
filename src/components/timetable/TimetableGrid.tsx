
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TimetableEntry } from "@/types";
import { getTimeSlot } from "./utils/TimeSlotData";
import MobileTimetableView from "./MobileTimetableView";
import DesktopTimetableView from "./DesktopTimetableView";

interface TimetableGridProps {
  entries: TimetableEntry[];
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ entries }) => {
  const isMobile = useIsMobile();
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  // Function to find entry for a specific time slot
  const findEntry = (day: string, slotNum: number): TimetableEntry | null => {
    const timeSlot = getTimeSlot(day, slotNum);
    if (!timeSlot) return null;
    
    return entries.find(entry => entry.timeSlotId === timeSlot.id) || null;
  };

  if (isMobile) {
    // Mobile view: show only one day at a time with tabs for day selection
    return (
      <MobileTimetableView 
        entries={entries}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        findEntry={findEntry}
      />
    );
  }

  // Desktop view: show full week timetable in a grid
  return <DesktopTimetableView entries={entries} findEntry={findEntry} />;
};

export default TimetableGrid;
