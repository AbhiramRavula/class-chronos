
import { Course, Faculty, Room, TimetableEntry } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Load timetable data from Supabase instead of localStorage
export const loadTimetableData = async () => {
  try {
    // Fetch courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*');
    
    if (coursesError) throw coursesError;

    // Fetch faculty
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty')
      .select('*');
    
    if (facultyError) throw facultyError;

    // Fetch rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) throw roomsError;

    // Fetch existing timetable entries
    const { data: timetableEntries, error: timetableError } = await supabase
      .from('timetable_entries')
      .select(`
        *,
        course:courses(*),
        faculty:faculty(*),
        room:rooms(*)
      `);
    
    if (timetableError) throw timetableError;

    const hasData = courses && courses.length > 0 && 
                   faculty && faculty.length > 0 && 
                   rooms && rooms.length > 0;

    return {
      courses: courses || [],
      faculty: faculty || [],
      rooms: rooms || [],
      timetableEntries: timetableEntries || [],
      hasData
    };
  } catch (error) {
    console.error("Error loading timetable data:", error);
    toast.error("Failed to load timetable data");
    
    return {
      courses: [],
      faculty: [],
      rooms: [],
      timetableEntries: [],
      hasData: false
    };
  }
};

// Helper function to find appropriate room based on course enrollment
const findSuitableRoom = (course: Course, rooms: Room[]): Room | null => {
  const availableRooms = rooms.filter(room => room.capacity >= course.enrollment);
  return availableRooms.length > 0 ? availableRooms[0] : null;
};

// Helper function to choose appropriate faculty for a course
const findSuitableFaculty = (course: Course, faculty: Faculty[]): Faculty | null => {
  // Based on course code prefix, choose a faculty with matching department or specialization
  const coursePrefix = course.code.substring(0, 2).toLowerCase();
  
  let matchedFaculty = null;
  
  if (coursePrefix === 'cs' || coursePrefix === 'ai') {
    matchedFaculty = faculty.find(f => 
      f.department?.toLowerCase().includes('computer') || 
      f.specializations?.some(s => s.toLowerCase().includes('artificial') || s.toLowerCase().includes('machine'))
    );
  } else if (coursePrefix === 'ma') {
    matchedFaculty = faculty.find(f => 
      f.department?.toLowerCase().includes('math') || 
      f.specializations?.some(s => s.toLowerCase().includes('algebra') || s.toLowerCase().includes('probability'))
    );
  } else if (coursePrefix === 'ee') {
    matchedFaculty = faculty.find(f => 
      f.department?.toLowerCase().includes('electrical') || 
      f.specializations?.some(s => s.toLowerCase().includes('embedded') || s.toLowerCase().includes('iot'))
    );
  } else if (coursePrefix === 'me') {
    matchedFaculty = faculty.find(f => 
      f.department?.toLowerCase().includes('mechanical') || 
      f.specializations?.some(s => s.toLowerCase().includes('thermodynamics'))
    );
  }
  
  // If no specific match found, return any faculty
  return matchedFaculty || (faculty.length > 0 ? faculty[0] : null);
};

// Function to check if a time slot is already occupied
const isTimeSlotOccupied = (
  timeSlotId: string,
  roomId: string,
  facultyId: string,
  generatedEntries: TimetableEntry[]
): boolean => {
  return generatedEntries.some(entry => 
    entry.timeSlotId === timeSlotId ||
    (entry.roomId === roomId && entry.timeSlotId === timeSlotId) ||
    (entry.facultyId === facultyId && entry.timeSlotId === timeSlotId)
  );
};

export const generateTimetable = async (): Promise<TimetableEntry[]> => {
  try {
    // Load all data
    const { courses, faculty, rooms } = await loadTimetableData();
    
    if (!courses.length || !faculty.length || !rooms.length) {
      toast.error("Missing data for timetable generation");
      return [];
    }

    // Generate timetable entries
    const newEntries: TimetableEntry[] = [];
    
    for (const course of courses) {
      // Find suitable room and faculty
      const room = findSuitableRoom(course, rooms);
      const facultyMember = findSuitableFaculty(course, faculty);
      
      if (!room || !facultyMember) {
        console.warn(`Could not find suitable room or faculty for ${course.name}`);
        continue;
      }
      
      // For each course, assign appropriate time slots based on duration
      const durationHours = course.durationHours || 1;
      let assigned = false;
      
      // Try to find available slots (starting from Monday)
      for (let day = 1; day <= 5 && !assigned; day++) {
        // Calculate day offset based on timeSlotId format (1-8 are Monday, 9-16 are Tuesday, etc.)
        const dayOffset = (day - 1) * 8;
        
        for (let hour = 1; hour <= 8 - (durationHours - 1) && !assigned; hour++) {
          const timeSlotId = (dayOffset + hour).toString();
          
          // Check if this time slot works
          if (!isTimeSlotOccupied(timeSlotId, room.id, facultyMember.id, newEntries)) {
            // Create entry
            const entry: TimetableEntry = {
              id: crypto.randomUUID(),
              courseId: course.id,
              facultyId: facultyMember.id, 
              roomId: room.id,
              timeSlotId: timeSlotId,
              course: course,
              faculty: facultyMember,
              room: room
            };
            
            newEntries.push(entry);
            assigned = true;
          }
        }
      }
      
      if (!assigned) {
        console.warn(`Could not find suitable time slot for ${course.name}`);
      }
    }

    // Save to Supabase
    if (newEntries.length > 0) {
      // First, clear any existing entries
      await supabase.from('timetable_entries').delete().neq('id', '0');
      
      // Then insert new entries (without the nested objects)
      const entriesToInsert = newEntries.map(({ course, faculty, room, ...entry }) => entry);
      
      const { error } = await supabase
        .from('timetable_entries')
        .insert(entriesToInsert);
      
      if (error) {
        console.error("Error saving timetable:", error);
        toast.error("Failed to save timetable to database");
      } else {
        toast.success("Timetable successfully generated!");
      }
    }
    
    return newEntries;
  } catch (error) {
    console.error("Error generating timetable:", error);
    toast.error("Failed to generate timetable");
    return [];
  }
};

export const saveTimetable = async (timetableEntries: TimetableEntry[]) => {
  if (timetableEntries.length > 0) {
    try {
      // Clear existing entries first
      await supabase.from('timetable_entries').delete().neq('id', '0');
      
      // Then insert new entries (without the nested objects)
      const entriesToInsert = timetableEntries.map(({ course, faculty, room, ...entry }) => entry);
      
      const { error } = await supabase
        .from('timetable_entries')
        .insert(entriesToInsert);
      
      if (error) {
        throw error;
      }
      
      toast.success("Timetable saved successfully");
    } catch (error) {
      console.error("Error saving timetable:", error);
      toast.error("Failed to save timetable");
    }
  }
};

export const clearTimetable = async () => {
  try {
    const { error } = await supabase
      .from('timetable_entries')
      .delete()
      .neq('id', '0');
    
    if (error) {
      throw error;
    }
    
    toast.success("Timetable cleared");
    return [];
  } catch (error) {
    console.error("Error clearing timetable:", error);
    toast.error("Failed to clear timetable");
    return [];
  }
};

// Initialize the database with provided data
export const initializeDatabaseWithSampleData = async () => {
  try {
    // Sample faculty data
    const facultyData: Omit<Faculty, 'id'>[] = [
      {
        name: "Dr. Alice Johnson",
        email: "alice.johnson@university.edu",
        department: "Computer Science",
        specializations: ["Artificial Intelligence", "Machine Learning", "Data Science"]
      },
      {
        name: "Dr. Robert Brown",
        email: "robert.brown@university.edu",
        department: "Mathematics",
        specializations: ["Algebra", "Probability", "Statistics"]
      },
      {
        name: "Dr. Emily Carter",
        email: "emily.carter@university.edu",
        department: "Physics",
        specializations: ["Quantum Mechanics", "Astrophysics", "Optics"]
      },
      {
        name: "Dr. Michael Lee",
        email: "michael.lee@university.edu",
        department: "Electrical Engineering",
        specializations: ["Embedded Systems", "IoT", "Signal Processing"]
      },
      {
        name: "Dr. Sophia White",
        email: "sophia.white@university.edu",
        department: "Mechanical Engineering",
        specializations: ["Fluid Dynamics", "Thermodynamics", "Robotics"]
      }
    ];

    // Sample rooms data
    const roomsData: Omit<Room, 'id'>[] = [
      {
        name: "Room 101",
        capacity: 30,
        building: "Science Building",
        floor: 1,
        hasProjector: true
      },
      {
        name: "Room 202",
        capacity: 50,
        building: "Engineering Block",
        floor: 2,
        hasProjector: true,
        hasComputers: true
      },
      {
        name: "Lab A",
        capacity: 25,
        building: "Computer Lab",
        floor: 0,
        hasProjector: true,
        hasComputers: true
      },
      {
        name: "Room 303",
        capacity: 40,
        building: "Mathematics Wing",
        floor: 3,
        hasProjector: true
      },
      {
        name: "Seminar Hall",
        capacity: 100,
        building: "Main Admin Block",
        floor: 1,
        hasProjector: true
      }
    ];

    // Sample courses data
    const coursesData: Omit<Course, 'id'>[] = [
      {
        name: "Introduction to Computer Science",
        code: "CS101",
        enrollment: 30,
        durationHours: 3,
        description: "Covers basics of programming, algorithms, and data structures."
      },
      {
        name: "Linear Algebra for Engineers",
        code: "MATH204",
        enrollment: 40,
        durationHours: 2,
        description: "Focuses on vector spaces, matrices, and applications in engineering."
      },
      {
        name: "Fundamentals of Artificial Intelligence",
        code: "AI301",
        enrollment: 35,
        durationHours: 3,
        description: "Introduction to AI concepts, search algorithms, and machine learning."
      },
      {
        name: "Embedded Systems and IoT",
        code: "EE405",
        enrollment: 25,
        durationHours: 3,
        description: "Covers microcontrollers, IoT devices, and real-time operating systems."
      },
      {
        name: "Thermodynamics",
        code: "ME210",
        enrollment: 50,
        durationHours: 2,
        description: "Fundamental concepts of heat, energy, and their engineering applications."
      }
    ];

    // Check if tables are empty before inserting
    const { data: existingFaculty } = await supabase.from('faculty').select('id').limit(1);
    const { data: existingRooms } = await supabase.from('rooms').select('id').limit(1);
    const { data: existingCourses } = await supabase.from('courses').select('id').limit(1);

    // Insert faculty if table is empty
    if (!existingFaculty?.length) {
      const { error: facultyError } = await supabase.from('faculty').insert(facultyData);
      if (facultyError) throw facultyError;
    }

    // Insert rooms if table is empty
    if (!existingRooms?.length) {
      const { error: roomsError } = await supabase.from('rooms').insert(roomsData);
      if (roomsError) throw roomsError;
    }

    // Insert courses if table is empty
    if (!existingCourses?.length) {
      const { error: coursesError } = await supabase.from('courses').insert(coursesData);
      if (coursesError) throw coursesError;
    }

    toast.success("Sample data initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing sample data:", error);
    toast.error("Failed to initialize sample data");
    return false;
  }
};
