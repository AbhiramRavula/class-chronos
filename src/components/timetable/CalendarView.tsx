
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimetableEntry } from "@/types";
import { getTimeSlot } from "./utils/TimeSlotData";

interface CalendarViewProps {
  date: Date;
  setDate: (date: Date) => void;
  timetableEntries: TimetableEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  date,
  setDate,
  timetableEntries,
}) => {
  // Get the entries for the selected day
  const getDayName = (date: Date): string => {
    const weekday = date.getDay();
    // Convert 0-6 (Sunday-Saturday) to Monday-Friday (1-5)
    // In our system: Monday=1, Tuesday=2, etc.
    if (weekday === 0) return ""; // Sunday - no classes
    if (weekday === 6) return ""; // Saturday - no classes
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][weekday - 1];
  };

  const dayName = getDayName(date);
  
  // Filter entries for the selected day
  const dayEntries = timetableEntries.filter(entry => {
    const timeSlot = getTimeSlot(dayName, parseInt(entry.timeSlotId));
    return timeSlot?.day === dayName;
  });

  return (
    <>
      <div className="flex justify-center p-4">
        <div className="border border-border rounded-lg overflow-hidden bg-card max-w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md"
            disabled={{ 
              before: new Date(2023, 0, 1),
              // Disable weekends
              function: (date) => {
                const day = date.getDay();
                return day === 0 || day === 6;
              }
            }}
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
        <h3 className="font-medium mb-3">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <div className="space-y-3">
          {dayEntries.length > 0 ? (
            dayEntries.map(entry => {
              const timeSlot = getTimeSlot(dayName, parseInt(entry.timeSlotId));
              
              return (
                <div key={entry.id} className="p-3 border border-border rounded-lg bg-background flex justify-between items-center">
                  <div>
                    <div className="font-medium">{entry.course?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.faculty?.name} • {entry.room?.name}
                    </div>
                  </div>
                  <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {timeSlot?.startTime} - {timeSlot?.endTime}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {dayName ? "No classes scheduled for this day" : "Weekend - No classes"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CalendarView;
