
import { TimeSlot } from "@/types";

// Days of the week
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Slots per day
export const SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];

// Define colors for different courses (for visual distinction)
export const COURSE_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-teal-100 border-teal-300 text-teal-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
  "bg-red-100 border-red-300 text-red-800",
];

// Demo data for time slots
export const TIME_SLOTS: TimeSlot[] = [
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
];

// Function to get a time slot for a specific day and slot number
export const getTimeSlot = (day: string, slotNum: number): TimeSlot | undefined => {
  return TIME_SLOTS.find(slot => slot.day === day && slot.slot === slotNum);
};

// Function to get color for a course
export const getCourseColor = (courseId: string): string => {
  if (!courseId) return COURSE_COLORS[0]; // Default color if courseId is undefined
  const index = courseId.charCodeAt(0) % COURSE_COLORS.length;
  return COURSE_COLORS[index];
};
