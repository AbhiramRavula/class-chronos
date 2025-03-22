
import React from "react";
import { cn } from "@/lib/utils";
import { TimetableEntry } from "@/types";
import { DAYS, SLOTS, getTimeSlot, getCourseColor } from "./utils/TimeSlotData";

interface MobileTimetableViewProps {
  entries: TimetableEntry[];
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  findEntry: (day: string, slotNum: number) => TimetableEntry | null;
}

const MobileTimetableView: React.FC<MobileTimetableViewProps> = ({
  entries,
  selectedDay,
  setSelectedDay,
  findEntry,
}) => {
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto mb-4 pb-2 gap-2">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={cn(
              "px-4 py-2 rounded-lg whitespace-nowrap transition-all",
              selectedDay === day
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-3 animate-fade-in">
        {SLOTS.map(slotNum => {
          const timeSlot = getTimeSlot(selectedDay, slotNum);
          const entry = findEntry(selectedDay, slotNum);
          
          return (
            <div key={`${selectedDay}-${slotNum}`} className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted px-3 py-2 font-medium text-sm">
                {timeSlot?.startTime} - {timeSlot?.endTime}
              </div>
              {entry ? (
                <div className={cn("p-3 border-t border-border", getCourseColor(entry.courseId))}>
                  <div className="font-medium">{entry.course?.name}</div>
                  <div className="text-sm mt-1 opacity-80">
                    {entry.faculty?.name} • {entry.room?.name}
                  </div>
                </div>
              ) : (
                <div className="p-3 text-muted-foreground italic text-sm">
                  No class scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTimetableView;
