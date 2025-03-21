
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataEntryForm from "@/components/forms/DataEntryForm";
import { Course } from "@/types";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "add">("add");

  // Load saved courses from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save courses to localStorage when updated
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleAddCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    setActiveTab("list");
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    toast.success("Course deleted successfully");
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
                <BookOpen className="h-8 w-8 text-primary" />
                Courses Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Add and manage course information for your timetable
              </p>
            </div>
            
            <div className="flex gap-2">
              <CustomButton 
                variant={activeTab === "add" ? "default" : "outline"} 
                onClick={() => setActiveTab("add")}
                className="shadow-sm border border-gray-200 dark:border-gray-800"
              >
                <Plus size={16} className="mr-2" />
                Add New
              </CustomButton>
              <CustomButton 
                variant="default"
                className={activeTab === "list" ? "" : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"}
                onClick={() => setActiveTab("list")}
              >
                View All ({courses.length})
              </CustomButton>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsContent value="add" className="animate-fade-in">
              <GlassCard className="max-w-3xl mx-auto">
                <DataEntryForm 
                  onAddCourse={handleAddCourse} 
                  activeTab="courses" 
                />
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="list" className="animate-fade-in">
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <GlassCard 
                      key={course.id} 
                      className="relative overflow-hidden"
                    >
                      <div className="bg-primary/10 p-2 absolute top-0 right-0 rounded-bl-lg">
                        <p className="text-xs font-medium">{course.code}</p>
                      </div>
                      <div className="pt-6">
                        <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                        <div className="flex gap-2 flex-wrap mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {course.enrollment} students
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {course.durationHours} hour{course.durationHours > 1 ? 's' : ''}
                          </span>
                        </div>
                        {course.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {course.description}
                          </p>
                        )}
                        <div className="flex justify-end">
                          <CustomButton 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 size={16} />
                          </CustomButton>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Courses Added Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add some courses to get started with your timetable.
                  </p>
                  <CustomButton onClick={() => setActiveTab("add")} className="shadow-md">
                    <Plus size={16} className="mr-2" />
                    Add Your First Course
                  </CustomButton>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
