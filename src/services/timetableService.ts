
import { Course, Faculty, Room, TimetableEntry } from "@/types";
import { toast } from "sonner";

// Sample timetable entries for demonstration
export const sampleTimetableEntries: TimetableEntry[] = [
  {
    id: "1",
    courseId: "c1",
    facultyId: "f1",
    roomId: "r1",
    timeSlotId: "1",
    course: { id: "c1", name: "Introduction to Computer Science", code: "CS101", enrollment: 30, durationHours: 1 },
    faculty: { id: "f1", name: "Dr. Alan Turing", email: "alan.turing@university.edu" },
    room: { id: "r1", name: "Room 101", capacity: 35 },
  },
  {
    id: "2",
    courseId: "c2",
    facultyId: "f2",
    roomId: "r2",
    timeSlotId: "11",
    course: { id: "c2", name: "Data Structures", code: "CS201", enrollment: 25, durationHours: 1 },
    faculty: { id: "f2", name: "Dr. Ada Lovelace", email: "ada.lovelace@university.edu" },
    room: { id: "r2", name: "Room 202", capacity: 30 },
  },
  {
    id: "3",
    courseId: "c3",
    facultyId: "f3",
    roomId: "r3",
    timeSlotId: "21",
    course: { id: "c3", name: "Algorithms", code: "CS301", enrollment: 20, durationHours: 1 },
    faculty: { id: "f3", name: "Dr. John von Neumann", email: "john.neumann@university.edu" },
    room: { id: "r3", name: "Room 303", capacity: 25 },
  },
  {
    id: "4",
    courseId: "c4",
    facultyId: "f1",
    roomId: "r1",
    timeSlotId: "31",
    course: { id: "c4", name: "Computer Networks", code: "CS401", enrollment: 15, durationHours: 1 },
    faculty: { id: "f1", name: "Dr. Alan Turing", email: "alan.turing@university.edu" },
    room: { id: "r1", name: "Room 101", capacity: 35 },
  },
  {
    id: "5",
    courseId: "c5",
    facultyId: "f2",
    roomId: "r2",
    timeSlotId: "34",
    course: { id: "c5", name: "Database Systems", code: "CS402", enrollment: 22, durationHours: 1 },
    faculty: { id: "f2", name: "Dr. Ada Lovelace", email: "ada.lovelace@university.edu" },
    room: { id: "r2", name: "Room 202", capacity: 30 },
  },
];

export const loadTimetableData = () => {
  const savedCourses = localStorage.getItem("courses");
  const savedFaculty = localStorage.getItem("faculty");
  const savedRooms = localStorage.getItem("rooms");
  const savedTimetable = localStorage.getItem("timetable");

  const courses = savedCourses ? JSON.parse(savedCourses) : [];
  const faculty = savedFaculty ? JSON.parse(savedFaculty) : [];
  const rooms = savedRooms ? JSON.parse(savedRooms) : [];
  const timetableEntries = savedTimetable ? JSON.parse(savedTimetable) : [];

  const hasData = (
    (savedCourses && JSON.parse(savedCourses).length > 0) &&
    (savedFaculty && JSON.parse(savedFaculty).length > 0) &&
    (savedRooms && JSON.parse(savedRooms).length > 0)
  );

  return {
    courses,
    faculty,
    rooms,
    timetableEntries,
    hasData
  };
};

export const generateTimetable = (): Promise<TimetableEntry[]> => {
  return new Promise((resolve) => {
    // Simulate timetable generation with a delay
    setTimeout(() => {
      toast.success("Timetable successfully generated!");
      resolve(sampleTimetableEntries);
    }, 2000);
  });
};

export const saveTimetable = (timetableEntries: TimetableEntry[]) => {
  if (timetableEntries.length > 0) {
    localStorage.setItem("timetable", JSON.stringify(timetableEntries));
  }
};

export const clearTimetable = () => {
  localStorage.removeItem("timetable");
  toast.success("Timetable cleared");
  return [];
};
