
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimetableEntry } from "@/types";

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
  return (
    <>
      <div className="flex justify-center p-4">
        <div className="border border-border rounded-lg overflow-hidden bg-card max-w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md"
            disabled={{ before: new Date(2023, 0, 1) }}
          />
        </div>
      </div>
      
      <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
        <h3 className="font-medium mb-3">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <div className="space-y-3">
          {timetableEntries
            .filter(entry => {
              const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
              return entry.timeSlotId && parseInt(entry.timeSlotId) <= 8;
            })
            .map(entry => (
              <div key={entry.id} className="p-3 border border-border rounded-lg bg-background flex justify-between items-center">
                <div>
                  <div className="font-medium">{entry.course?.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.faculty?.name} • {entry.room?.name}
                  </div>
                </div>
                <div className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  9:00 - 10:00
                </div>
              </div>
            ))}
            
            {timetableEntries.filter(entry => parseInt(entry.timeSlotId) <= 8).length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No classes scheduled for this day
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default CalendarView;
