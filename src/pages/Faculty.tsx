
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataEntryForm from "@/components/forms/DataEntryForm";
import { Faculty as FacultyType } from "@/types";
import { Users, Plus, Trash2, Mail, Building, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Faculty = () => {
  const [faculty, setFaculty] = useState<FacultyType[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "add">("add");

  // Load saved faculty from localStorage
  useEffect(() => {
    const savedFaculty = localStorage.getItem("faculty");
    if (savedFaculty) {
      setFaculty(JSON.parse(savedFaculty));
    }
  }, []);

  // Save faculty to localStorage when updated
  useEffect(() => {
    localStorage.setItem("faculty", JSON.stringify(faculty));
  }, []);

  const handleAddFaculty = (facultyMember: FacultyType) => {
    setFaculty(prev => [...prev, facultyMember]);
    setActiveTab("list");
  };

  const handleDeleteFaculty = (id: string) => {
    setFaculty(prev => prev.filter(member => member.id !== id));
    toast.success("Faculty member deleted successfully");
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
                <Users className="h-8 w-8 text-primary" />
                Faculty Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Add and manage faculty information for your timetable
              </p>
            </div>
            
            <div className="flex gap-2">
              <CustomButton 
                variant={activeTab === "add" ? "default" : "outline"} 
                onClick={() => setActiveTab("add")}
              >
                <Plus size={16} className="mr-2" />
                Add New
              </CustomButton>
              <CustomButton 
                variant={activeTab === "list" ? "default" : "outline"} 
                onClick={() => setActiveTab("list")}
              >
                View All ({faculty.length})
              </CustomButton>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsContent value="add" className="animate-fade-in">
              <GlassCard className="max-w-3xl mx-auto">
                <DataEntryForm 
                  onAddFaculty={handleAddFaculty} 
                  activeTab="faculty" 
                />
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="list" className="animate-fade-in">
              {faculty.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.map((member) => (
                    <GlassCard 
                      key={member.id}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col">
                        <h3 className="text-xl font-semibold mb-3">{member.name}</h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail size={16} className="text-muted-foreground" />
                            <span>{member.email}</span>
                          </div>
                          
                          {member.department && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building size={16} className="text-muted-foreground" />
                              <span>{member.department}</span>
                            </div>
                          )}
                        </div>
                        
                        {member.specializations && member.specializations.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                              <Bookmark size={14} />
                              Specializations
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {member.specializations.map((spec, index) => (
                                <Badge key={index} variant="secondary" className="font-normal">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end mt-auto">
                          <CustomButton 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteFaculty(member.id)}
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
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Faculty Members Added Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add faculty members to assign them to courses in your timetable.
                  </p>
                  <CustomButton onClick={() => setActiveTab("add")}>
                    <Plus size={16} className="mr-2" />
                    Add Your First Faculty Member
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

export default Faculty;
