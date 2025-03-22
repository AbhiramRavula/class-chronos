import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { CustomButton } from "@/components/ui/custom-button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Course, Faculty, Room } from "@/types";
import { Check, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Form schemas
const courseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  code: z.string().min(1, "Course code is required"),
  enrollment: z.coerce.number().min(1, "Enrollment must be at least 1"),
  description: z.string().optional(),
  durationHours: z.coerce.number().min(1, "Duration must be at least 1 hour"),
});

const facultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().optional(),
  specializations: z.string().optional(),
});

const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  building: z.string().optional(),
  floor: z.coerce.number().optional(),
  hasProjector: z.boolean().default(false),
  hasComputers: z.boolean().default(false),
});

type CourseFormData = z.infer<typeof courseSchema>;
type FacultyFormData = z.infer<typeof facultySchema>;
type RoomFormData = z.infer<typeof roomSchema>;

interface DataEntryFormProps {
  onAddCourse?: (course: Course) => void;
  onAddFaculty?: (faculty: Faculty) => void;
  onAddRoom?: (room: Room) => void;
  activeTab?: "courses" | "faculty" | "rooms";
}

const DataEntryForm: React.FC<DataEntryFormProps> = ({
  onAddCourse,
  onAddFaculty,
  onAddRoom,
  activeTab = "courses",
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Course form
  const courseForm = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      code: "",
      enrollment: 30,
      description: "",
      durationHours: 1,
    },
  });

  // Faculty form
  const facultyForm = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      specializations: "",
    },
  });

  // Room form
  const roomForm = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      capacity: 30,
      building: "",
      floor: 1,
      hasProjector: false,
      hasComputers: false,
    },
  });

  // Submit handlers
  const handleCourseSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      const { data: insertedData, error } = await supabase.from('courses').insert({
        name: data.name,
        code: data.code,
        enrollment: data.enrollment,
        description: data.description || null,
        duration_hours: data.durationHours
      }).select('*').single();
      
      if (error) throw error;
      
      if (insertedData) {
        const newCourse: Course = {
          id: insertedData.id,
          name: insertedData.name,
          code: insertedData.code,
          enrollment: insertedData.enrollment,
          durationHours: insertedData.duration_hours,
          description: insertedData.description || "",
        };
        
        if (onAddCourse) {
          onAddCourse(newCourse);
        }
        
        toast.success("Course added successfully!");
        courseForm.reset();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacultySubmit = async (data: FacultyFormData) => {
    setIsSubmitting(true);
    try {
      const specializations = data.specializations 
        ? data.specializations.split(",").map(s => s.trim())
        : [];
        
      const { data: insertedData, error } = await supabase.from('faculty').insert({
        name: data.name,
        email: data.email,
        department: data.department || null,
        specializations: specializations
      }).select('*').single();
      
      if (error) throw error;
      
      if (insertedData) {
        const newFaculty: Faculty = {
          id: insertedData.id,
          name: insertedData.name,
          email: insertedData.email,
          department: insertedData.department || "",
          specializations: insertedData.specializations || [],
        };
        
        if (onAddFaculty) {
          onAddFaculty(newFaculty);
        }
        
        toast.success("Faculty member added successfully!");
        facultyForm.reset();
      }
    } catch (error) {
      console.error("Error adding faculty:", error);
      toast.error("Failed to add faculty member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoomSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);
    try {
      const { data: insertedData, error } = await supabase.from('rooms').insert({
        name: data.name,
        capacity: data.capacity,
        building: data.building || null,
        floor: data.floor || null,
        has_projector: data.hasProjector,
        has_computers: data.hasComputers,
      }).select('*').single();
      
      if (error) throw error;
      
      if (insertedData) {
        const newRoom: Room = {
          id: insertedData.id,
          name: insertedData.name,
          capacity: insertedData.capacity,
          building: insertedData.building || "",
          floor: insertedData.floor || 1,
          hasProjector: insertedData.has_projector || false,
          hasComputers: insertedData.has_computers || false,
        };
        
        if (onAddRoom) {
          onAddRoom(newRoom);
        }
        
        toast.success("Room added successfully!");
        roomForm.reset();
      }
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Failed to add room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="faculty">Faculty</TabsTrigger>
        <TabsTrigger value="rooms">Rooms</TabsTrigger>
      </TabsList>

      <TabsContent value="courses" className="animate-slide-up">
        <form onSubmit={courseForm.handleSubmit(handleCourseSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input 
                id="course-name" 
                placeholder="e.g. Introduction to Computer Science" 
                {...courseForm.register("name")} 
              />
              {courseForm.formState.errors.name && (
                <p className="text-destructive text-sm">{courseForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-code">Course Code</Label>
              <Input 
                id="course-code" 
                placeholder="e.g. CS101" 
                {...courseForm.register("code")} 
              />
              {courseForm.formState.errors.code && (
                <p className="text-destructive text-sm">{courseForm.formState.errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="enrollment">Expected Enrollment</Label>
              <Input 
                id="enrollment" 
                type="number" 
                placeholder="e.g. 30" 
                {...courseForm.register("enrollment")} 
              />
              {courseForm.formState.errors.enrollment && (
                <p className="text-destructive text-sm">{courseForm.formState.errors.enrollment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <ToggleGroup 
                type="single" 
                defaultValue="1"
                onValueChange={(value) => courseForm.setValue("durationHours", parseInt(value))}
                className="justify-start"
              >
                {[1, 2, 3].map(hours => (
                  <ToggleGroupItem 
                    key={hours} 
                    value={hours.toString()}
                    className="w-12 h-10"
                  >
                    {hours}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Brief description of the course" 
              {...courseForm.register("description")} 
            />
          </div>

          <CustomButton type="submit" className="w-full" loading={isSubmitting}>
            <Plus size={16} className="mr-2" />
            Add Course
          </CustomButton>
        </form>
      </TabsContent>

      <TabsContent value="faculty" className="animate-slide-up">
        <form onSubmit={facultyForm.handleSubmit(handleFacultySubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="faculty-name">Full Name</Label>
              <Input 
                id="faculty-name" 
                placeholder="e.g. Dr. Jane Smith" 
                {...facultyForm.register("name")} 
              />
              {facultyForm.formState.errors.name && (
                <p className="text-destructive text-sm">{facultyForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty-email">Email</Label>
              <Input 
                id="faculty-email" 
                type="email" 
                placeholder="e.g. jane.smith@university.edu" 
                {...facultyForm.register("email")} 
              />
              {facultyForm.formState.errors.email && (
                <p className="text-destructive text-sm">{facultyForm.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input 
              id="department" 
              placeholder="e.g. Computer Science" 
              {...facultyForm.register("department")} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specializations">Specializations (comma-separated)</Label>
            <Input 
              id="specializations" 
              placeholder="e.g. Algorithms, Machine Learning, Data Structures" 
              {...facultyForm.register("specializations")} 
            />
          </div>

          <CustomButton type="submit" className="w-full" loading={isSubmitting}>
            <Plus size={16} className="mr-2" />
            Add Faculty Member
          </CustomButton>
        </form>
      </TabsContent>

      <TabsContent value="rooms" className="animate-slide-up">
        <form onSubmit={roomForm.handleSubmit(handleRoomSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name/Number</Label>
              <Input 
                id="room-name" 
                placeholder="e.g. Room 101" 
                {...roomForm.register("name")} 
              />
              {roomForm.formState.errors.name && (
                <p className="text-destructive text-sm">{roomForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input 
                id="capacity" 
                type="number" 
                placeholder="e.g. 30" 
                {...roomForm.register("capacity")} 
              />
              {roomForm.formState.errors.capacity && (
                <p className="text-destructive text-sm">{roomForm.formState.errors.capacity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Input 
                id="building" 
                placeholder="e.g. Science Building" 
                {...roomForm.register("building")} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input 
                id="floor" 
                type="number" 
                placeholder="e.g. 1" 
                {...roomForm.register("floor")} 
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Facilities</Label>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasProjector" 
                  checked={roomForm.watch("hasProjector")}
                  onCheckedChange={(checked) => 
                    roomForm.setValue("hasProjector", checked as boolean)
                  }
                />
                <Label htmlFor="hasProjector" className="cursor-pointer">Has Projector</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasComputers" 
                  checked={roomForm.watch("hasComputers")}
                  onCheckedChange={(checked) => 
                    roomForm.setValue("hasComputers", checked as boolean)
                  }
                />
                <Label htmlFor="hasComputers" className="cursor-pointer">Has Computers</Label>
              </div>
            </div>
          </div>

          <CustomButton type="submit" className="w-full" loading={isSubmitting}>
            <Plus size={16} className="mr-2" />
            Add Room
          </CustomButton>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default DataEntryForm;
