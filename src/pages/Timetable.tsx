
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, Database } from "lucide-react";
import TimetableActions from "@/components/timetable/TimetableActions";
import TimetableContent from "@/components/timetable/TimetableContent";
import EmptyTimetableState from "@/components/timetable/EmptyTimetableState";
import { 
  loadTimetableData, 
  generateTimetable as generateTimetableService, 
  saveTimetable, 
  clearTimetable as clearTimetableService,
  initializeDatabaseWithSampleData
} from "@/services/timetableService";
import { TimetableEntry } from "@/types";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "sonner";

const Timetable = () => {
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"grid" | "calendar" | "google">("grid");

  // Load saved data from database
  useEffect(() => {
    const fetchData = async () => {
      const { timetableEntries, hasData } = await loadTimetableData();
      setTimetableEntries(timetableEntries);
      setHasData(hasData);
    };
    
    fetchData();
  }, []);

  // Save timetable to database when updated
  useEffect(() => {
    if (timetableEntries.length > 0) {
      saveTimetable(timetableEntries);
    }
  }, [timetableEntries]);

  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    try {
      const entries = await generateTimetableService();
      setTimetableEntries(entries);
    } catch (error) {
      console.error("Failed to generate timetable:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearTimetable = async () => {
    const entries = await clearTimetableService();
    setTimetableEntries(entries);
  };

  const handleInitializeData = async () => {
    setIsInitializing(true);
    try {
      const success = await initializeDatabaseWithSampleData();
      if (success) {
        // Refresh data after initialization
        const { timetableEntries, hasData } = await loadTimetableData();
        setTimetableEntries(timetableEntries);
        setHasData(hasData);
      }
    } catch (error) {
      console.error("Failed to initialize data:", error);
      toast.error("Failed to initialize sample data");
    } finally {
      setIsInitializing(false);
    }
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
              {!hasData && (
                <CustomButton
                  variant="outline"
                  onClick={handleInitializeData}
                  loading={isInitializing}
                  className="shadow-md"
                >
                  <Database size={16} className="mr-2" />
                  Initialize Sample Data
                </CustomButton>
              )}
              
              <TimetableActions 
                generateTimetable={handleGenerateTimetable}
                clearTimetable={handleClearTimetable}
                isGenerating={isGenerating}
                hasData={hasData}
                hasEntries={timetableEntries.length > 0}
              />
            </div>
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
