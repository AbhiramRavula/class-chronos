
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { CalendarClock } from "lucide-react";
import TimetableActions from "@/components/timetable/TimetableActions";
import TimetableContent from "@/components/timetable/TimetableContent";
import EmptyTimetableState from "@/components/timetable/EmptyTimetableState";
import { 
  loadTimetableData, 
  generateTimetable as generateTimetableService, 
  saveTimetable, 
  clearTimetable as clearTimetableService 
} from "@/services/timetableService";
import { TimetableEntry } from "@/types";

const Timetable = () => {
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"grid" | "calendar" | "google">("grid");

  // Load saved data from localStorage
  useEffect(() => {
    const { timetableEntries, hasData } = loadTimetableData();
    setTimetableEntries(timetableEntries);
    setHasData(hasData);
  }, []);

  // Save timetable to localStorage when updated
  useEffect(() => {
    saveTimetable(timetableEntries);
  }, [timetableEntries]);

  const handleGenerateTimetable = () => {
    setIsGenerating(true);
    generateTimetableService()
      .then(entries => {
        setTimetableEntries(entries);
        setIsGenerating(false);
      });
  };

  const handleClearTimetable = () => {
    setTimetableEntries(clearTimetableService());
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
            
            <TimetableActions 
              generateTimetable={handleGenerateTimetable}
              clearTimetable={handleClearTimetable}
              isGenerating={isGenerating}
              hasData={hasData}
              hasEntries={timetableEntries.length > 0}
            />
          </div>
          
          <Separator className="mb-8" />
          
          {timetableEntries.length > 0 ? (
            <TimetableContent 
              timetableEntries={timetableEntries}
              viewMode={viewMode}
              setViewMode={setViewMode}
              date={date}
              setDate={setDate}
            />
          ) : (
            <EmptyTimetableState hasData={hasData} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Timetable;
