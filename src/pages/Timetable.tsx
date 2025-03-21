
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { Course, Faculty, Room, TimetableEntry } from "@/types";
import { CalendarClock, Share, Download, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Sample data for demonstration
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

    // Check if we have enough data to generate a timetable
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
    // In a real implementation, this would call the AI service
    // For demo purposes, we'll simulate a generation with a delay
    setIsGenerating(true);
    
    setTimeout(() => {
      setTimetableEntries(
        // If user has entered their own data, we'd use that to generate a realistic timetable
        // For demo purposes, we'll use the sample data
        sampleTimetableEntries
      );
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
              >
                <RefreshCw size={16} className="mr-2" />
                Generate
              </CustomButton>
              
              {timetableEntries.length > 0 && (
                <>
                  <CustomButton variant="outline">
                    <Download size={16} className="mr-2" />
                    Export
                  </CustomButton>
                  <CustomButton variant="outline">
                    <Share size={16} className="mr-2" />
                    Share
                  </CustomButton>
                  <CustomButton 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                    <p className="text-sm text-muted-foreground">
                      Last generated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="overflow-auto">
                    <TimetableGrid entries={timetableEntries} />
                  </div>
                </div>
              </GlassCard>
              
              <div className="flex justify-end">
                <CustomButton variant="outline" size="sm">
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
                    <CustomButton className="gap-2">
                      Add Courses
                      <ArrowRight size={16} />
                    </CustomButton>
                  </Link>
                  <Link to="/faculty">
                    <CustomButton variant="outline" className="gap-2">
                      Add Faculty
                      <ArrowRight size={16} />
                    </CustomButton>
                  </Link>
                  <Link to="/rooms">
                    <CustomButton variant="outline" className="gap-2">
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
