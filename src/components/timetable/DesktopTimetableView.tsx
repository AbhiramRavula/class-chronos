
import React from "react";
import { cn } from "@/lib/utils";
import { TimetableEntry } from "@/types";
import { DAYS, SLOTS, getTimeSlot, getCourseColor } from "./utils/TimeSlotData";

interface DesktopTimetableViewProps {
  entries: TimetableEntry[];
  findEntry: (day: string, slotNum: number) => TimetableEntry | null;
}

const DesktopTimetableView: React.FC<DesktopTimetableViewProps> = ({
  entries,
  findEntry,
}) => {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="p-3 border border-border bg-muted text-left font-medium">Time</th>
            {DAYS.map(day => (
              <th key={day} className="p-3 border border-border bg-muted text-left font-medium min-w-[200px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map(slotNum => {
            // Get the time string for this slot (using Monday as reference)
            const timeSlot = getTimeSlot("Monday", slotNum);
            
            return (
              <tr key={slotNum} className="hover:bg-muted/30 transition-colors">
                <td className="p-3 border border-border font-medium text-sm">
                  {timeSlot?.startTime} - {timeSlot?.endTime}
                </td>
                
                {DAYS.map(day => {
                  const entry = findEntry(day, slotNum);
                  
                  return (
                    <td key={`${day}-${slotNum}`} className="p-0 border border-border">
                      {entry ? (
                        <div className={cn("p-3 h-full", getCourseColor(entry.courseId))}>
                          <div className="font-medium">{entry.course?.name}</div>
                          <div className="text-sm mt-1 opacity-80">
                            {entry.faculty?.name}
                          </div>
                          <div className="text-sm opacity-80">
                            {entry.room?.name}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 text-muted-foreground italic text-sm">
                          Available
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopTimetableView;
