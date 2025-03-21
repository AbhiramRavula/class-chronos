
import React, { useState, useEffect } from "react";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { CustomButton } from "@/components/ui/custom-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataEntryForm from "@/components/forms/DataEntryForm";
import { Room } from "@/types";
import { Building, Plus, Trash2, Users, PanelTop, Monitor } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "add">("add");

  // Load saved rooms from localStorage
  useEffect(() => {
    const savedRooms = localStorage.getItem("rooms");
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    }
  }, []);

  // Save rooms to localStorage when updated
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, []);

  const handleAddRoom = (room: Room) => {
    setRooms(prev => [...prev, room]);
    setActiveTab("list");
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    toast.success("Room deleted successfully");
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
                <Building className="h-8 w-8 text-primary" />
                Rooms Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Add and manage room information for your timetable
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
                View All ({rooms.length})
              </CustomButton>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsContent value="add" className="animate-fade-in">
              <GlassCard className="max-w-3xl mx-auto">
                <DataEntryForm 
                  onAddRoom={handleAddRoom} 
                  activeTab="rooms" 
                />
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="list" className="animate-fade-in">
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <GlassCard 
                      key={room.id}
                    >
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold">{room.name}</h3>
                          <Badge variant="secondary" className="font-normal">
                            <Users className="h-3 w-3 mr-1" />
                            {room.capacity}
                          </Badge>
                        </div>
                        
                        {room.building && (
                          <div className="text-sm text-muted-foreground">
                            {room.building}{room.floor ? `, Floor ${room.floor}` : ''}
                          </div>
                        )}
                        
                        <div className="flex gap-2 flex-wrap">
                          {room.hasProjector && (
                            <Badge variant="outline" className="bg-secondary/50">
                              <PanelTop className="h-3 w-3 mr-1" />
                              Projector
                            </Badge>
                          )}
                          {room.hasComputers && (
                            <Badge variant="outline" className="bg-secondary/50">
                              <Monitor className="h-3 w-3 mr-1" />
                              Computers
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex justify-end mt-2">
                          <CustomButton 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteRoom(room.id)}
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
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Rooms Added Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add rooms to allocate them in your timetable.
                  </p>
                  <CustomButton onClick={() => setActiveTab("add")}>
                    <Plus size={16} className="mr-2" />
                    Add Your First Room
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

export default Rooms;
