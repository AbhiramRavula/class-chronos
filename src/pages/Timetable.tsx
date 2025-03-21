
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { Calendar } from "@/components/ui/calendar";
import { Course, Faculty, Room, TimetableEntry } from "@/types";
import { 
  CalendarClock, 
  Share, 
  Download, 
  RefreshCw, 
  ArrowRight, 
  Calendar as CalendarIcon,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample timetable entries for demonstration
const sampleTimetableEntries: TimetableEntry[] = [
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

const Timetable = () => {
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hasData, setHasData] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"grid" | "calendar" | "google">("grid");

  // Load saved data from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    const savedFaculty = localStorage.getItem("faculty");
    const savedRooms = localStorage.getItem("rooms");
    const savedTimetable = localStorage.getItem("timetable");

    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedFaculty) setFaculty(JSON.parse(savedFaculty));
    if (savedRooms) setRooms(JSON.parse(savedRooms));
    if (savedTimetable) setTimetableEntries(JSON.parse(savedTimetable));

    setHasData(
      (savedCourses && JSON.parse(savedCourses).length > 0) &&
      (savedFaculty && JSON.parse(savedFaculty).length > 0) &&
      (savedRooms && JSON.parse(savedRooms).length > 0)
    );
  }, []);

  // Save timetable to localStorage when updated
  useEffect(() => {
    if (timetableEntries.length > 0) {
      localStorage.setItem("timetable", JSON.stringify(timetableEntries));
    }
  }, [timetableEntries]);

  const generateTimetable = () => {
    setIsGenerating(true);
    
    // Simulate timetable generation with a delay
    setTimeout(() => {
      // For testing, we'll use sampleTimetableEntries
      // In a real app, this would use real data from courses, faculty, and rooms
      setTimetableEntries(sampleTimetableEntries);
      setIsGenerating(false);
      toast.success("Timetable successfully generated!");
    }, 2000);
  };

  const clearTimetable = () => {
    setTimetableEntries([]);
    localStorage.removeItem("timetable");
    toast.success("Timetable cleared");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedGradient intensity="subtle" />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <CalendarClock className="h-8 w-8 text-primary" />
                Timetable
              </h1>
              <p className="text-muted-foreground mt-2">
                View and generate your conflict-free timetable
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <CustomButton 
                variant="default" 
                onClick={generateTimetable}
                loading={isGenerating}
                disabled={!hasData && timetableEntries.length === 0}
                className="shadow-md"
              >
                <RefreshCw size={16} className="mr-2" />
                Generate
              </CustomButton>
              
              {timetableEntries.length > 0 && (
                <>
                  <CustomButton 
                    variant="secondary"
                    className="border border-gray-200 dark:border-gray-800 shadow-sm"
                  >
                    <Download size={16} className="mr-2" />
                    Export
                  </CustomButton>
                  <CustomButton 
                    variant="secondary"
                    className="border border-gray-200 dark:border-gray-800 shadow-sm"
                  >
                    <Share size={16} className="mr-2" />
                    Share
                  </CustomButton>
                  <CustomButton 
                    variant="outline" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shadow-sm"
                    onClick={clearTimetable}
                  >
                    Clear
                  </CustomButton>
                </>
              )}
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          {timetableEntries.length > 0 ? (
            <div className="animate-fade-in">
              <GlassCard className="mb-8">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Current Timetable</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-muted-foreground">
                        Last generated: {new Date().toLocaleDateString()}
                      </p>
                      
                      <Tabs 
                        value={viewMode} 
                        onValueChange={(value) => setViewMode(value as "grid" | "calendar" | "google")}
                        className="ml-2"
                      >
                        <TabsList className="h-9">
                          <TabsTrigger value="grid" className="text-xs px-3">
                            <CalendarClock size={16} className="mr-2" />
                            Grid View
                          </TabsTrigger>
                          <TabsTrigger value="calendar" className="text-xs px-3">
                            <CalendarIcon size={16} className="mr-2" />
                            Calendar View
                          </TabsTrigger>
                          <TabsTrigger value="google" className="text-xs px-3">
                            <ExternalLink size={16} className="mr-2" />
                            Google Calendar
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="overflow-auto">
                    <TabsContent value="grid" className="m-0">
                      <TimetableGrid entries={timetableEntries} />
                    </TabsContent>
                    
                    <TabsContent value="calendar" className="m-0">
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
                    </TabsContent>
                    
                    <TabsContent value="google" className="m-0">
                      <div className="flex justify-center p-4 overflow-x-auto">
                        <iframe 
                          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&src=MmFiZDkxYWZmYjc5NDQwYWEzOWIxOGQ0YzBhNzhiYTRhZTFmMmRiZTRjMDNjZTRlNDZjOTQwMTgwNjUyYTliYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%239E69AF&color=%230B8043" 
                          style={{ border: "solid 1px #777" }} 
                          width="100%" 
                          height="600" 
                          frameBorder="0" 
                          scrolling="no"
                          title="Google Calendar"
                          className="max-w-full rounded-lg shadow-md"
                        />
                      </div>
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        <p>View and integrate with Google Calendar</p>
                      </div>
                    </TabsContent>
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
          ) : (
            <div className="text-center py-12 max-w-2xl mx-auto">
              <CalendarClock className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-medium mb-4">No Timetable Generated Yet</h3>
              <p className="text-muted-foreground mb-8">
                {hasData 
                  ? "Click 'Generate' to create a conflict-free timetable based on your courses, faculty, and rooms."
                  : "Please add courses, faculty, and rooms before generating a timetable."}
              </p>
              
              {!hasData && (
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/courses">
                    <CustomButton className="gap-2 shadow-md">
                      Add Courses
                      <ArrowRight size={16} />
                    </CustomButton>
                  </Link>
                  <Link to="/faculty">
                    <CustomButton variant="blue" className="gap-2 shadow-md">
                      Add Faculty
                      <ArrowRight size={16} />
                    </CustomButton>
                  </Link>
                  <Link to="/rooms">
                    <CustomButton variant="blue" className="gap-2 shadow-md">
                      Add Rooms
                      <ArrowRight size={16} />
                    </CustomButton>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Timetable;
