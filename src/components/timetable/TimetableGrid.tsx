
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { GlassCard } from "@/components/ui/glass-card";
import { TimetableEntry, TimeSlot } from "@/types";
import { cn } from "@/lib/utils";

// Demo data for time slots
const TIME_SLOTS = [
  { id: "1", day: "Monday", startTime: "09:00", endTime: "10:00", slot: 1 },
  { id: "2", day: "Monday", startTime: "10:00", endTime: "11:00", slot: 2 },
  { id: "3", day: "Monday", startTime: "11:00", endTime: "12:00", slot: 3 },
  { id: "4", day: "Monday", startTime: "12:00", endTime: "13:00", slot: 4 },
  { id: "5", day: "Monday", startTime: "14:00", endTime: "15:00", slot: 5 },
  { id: "6", day: "Monday", startTime: "15:00", endTime: "16:00", slot: 6 },
  { id: "7", day: "Monday", startTime: "16:00", endTime: "17:00", slot: 7 },
  { id: "8", day: "Monday", startTime: "17:00", endTime: "18:00", slot: 8 },
  // Tuesday
  { id: "9", day: "Tuesday", startTime: "09:00", endTime: "10:00", slot: 1 },
  { id: "10", day: "Tuesday", startTime: "10:00", endTime: "11:00", slot: 2 },
  { id: "11", day: "Tuesday", startTime: "11:00", endTime: "12:00", slot: 3 },
  { id: "12", day: "Tuesday", startTime: "12:00", endTime: "13:00", slot: 4 },
  { id: "13", day: "Tuesday", startTime: "14:00", endTime: "15:00", slot: 5 },
  { id: "14", day: "Tuesday", startTime: "15:00", endTime: "16:00", slot: 6 },
  { id: "15", day: "Tuesday", startTime: "16:00", endTime: "17:00", slot: 7 },
  { id: "16", day: "Tuesday", startTime: "17:00", endTime: "18:00", slot: 8 },
  // Wednesday
  { id: "17", day: "Wednesday", startTime: "09:00", endTime: "10:00", slot: 1 },
  { id: "18", day: "Wednesday", startTime: "10:00", endTime: "11:00", slot: 2 },
  { id: "19", day: "Wednesday", startTime: "11:00", endTime: "12:00", slot: 3 },
  { id: "20", day: "Wednesday", startTime: "12:00", endTime: "13:00", slot: 4 },
  { id: "21", day: "Wednesday", startTime: "14:00", endTime: "15:00", slot: 5 },
  { id: "22", day: "Wednesday", startTime: "15:00", endTime: "16:00", slot: 6 },
  { id: "23", day: "Wednesday", startTime: "16:00", endTime: "17:00", slot: 7 },
  { id: "24", day: "Wednesday", startTime: "17:00", endTime: "18:00", slot: 8 },
  // Thursday
  { id: "25", day: "Thursday", startTime: "09:00", endTime: "10:00", slot: 1 },
  { id: "26", day: "Thursday", startTime: "10:00", endTime: "11:00", slot: 2 },
  { id: "27", day: "Thursday", startTime: "11:00", endTime: "12:00", slot: 3 },
  { id: "28", day: "Thursday", startTime: "12:00", endTime: "13:00", slot: 4 },
  { id: "29", day: "Thursday", startTime: "14:00", endTime: "15:00", slot: 5 },
  { id: "30", day: "Thursday", startTime: "15:00", endTime: "16:00", slot: 6 },
  { id: "31", day: "Thursday", startTime: "16:00", endTime: "17:00", slot: 7 },
  { id: "32", day: "Thursday", startTime: "17:00", endTime: "18:00", slot: 8 },
  // Friday
  { id: "33", day: "Friday", startTime: "09:00", endTime: "10:00", slot: 1 },
  { id: "34", day: "Friday", startTime: "10:00", endTime: "11:00", slot: 2 },
  { id: "35", day: "Friday", startTime: "11:00", endTime: "12:00", slot: 3 },
  { id: "36", day: "Friday", startTime: "12:00", endTime: "13:00", slot: 4 },
  { id: "37", day: "Friday", startTime: "14:00", endTime: "15:00", slot: 5 },
  { id: "38", day: "Friday", startTime: "15:00", endTime: "16:00", slot: 6 },
  { id: "39", day: "Friday", startTime: "16:00", endTime: "17:00", slot: 7 },
  { id: "40", day: "Friday", startTime: "17:00", endTime: "18:00", slot: 8 },
] as TimeSlot[];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];

// Define colors for different courses (for visual distinction)
const COURSE_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-teal-100 border-teal-300 text-teal-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
  "bg-red-100 border-red-300 text-red-800",
];

interface TimetableGridProps {
  entries: TimetableEntry[];
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ entries }) => {
  const isMobile = useIsMobile();
  const [selectedDay, setSelectedDay] = useState<string>("Monday");

  // Function to get a time slot for a specific day and slot number
  const getTimeSlot = (day: string, slotNum: number) => {
    return TIME_SLOTS.find(slot => slot.day === day && slot.slot === slotNum);
  };

  // Function to find entry for a specific time slot
  const findEntry = (day: string, slotNum: number) => {
    const timeSlot = getTimeSlot(day, slotNum);
    if (!timeSlot) return null;
    
    return entries.find(entry => entry.timeSlotId === timeSlot.id);
  };

  // Function to get color for a course
  const getCourseColor = (courseId: string) => {
    const index = courseId.charCodeAt(0) % COURSE_COLORS.length;
    return COURSE_COLORS[index];
  };

  if (isMobile) {
    // Mobile view: show only one day at a time with tabs for day selection
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
  }

  // Desktop view: show full week timetable in a grid
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

export default TimetableGrid;
