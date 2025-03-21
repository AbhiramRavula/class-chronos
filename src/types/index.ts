
// Course information
export interface Course {
  id: string;
  name: string;
  code: string;
  enrollment: number;
  description?: string;
  durationHours: number;
}

// Faculty/teacher information
export interface Faculty {
  id: string;
  name: string;
  email: string;
  department?: string;
  specializations?: string[];
}

// Room information
export interface Room {
  id: string;
  name: string;
  capacity: number;
  building?: string;
  floor?: number;
  hasProjector?: boolean;
  hasComputers?: boolean;
}

// Time slot for scheduling
export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  slot: number; // 1-8 for the day
}

// An allocated time slot in the timetable
export interface TimetableEntry {
  id: string;
  courseId: string;
  facultyId: string;
  roomId: string;
  timeSlotId: string;
  // Populated data for display
  course?: Course;
  faculty?: Faculty;
  room?: Room;
  timeSlot?: TimeSlot;
}

// Complete timetable
export interface Timetable {
  id: string;
  name: string;
  entries: TimetableEntry[];
  createdAt: string;
}
