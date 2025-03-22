
import { Course, Faculty, Room, TimetableEntry } from "@/types";
import { toast } from "sonner";
import { supabase, CourseRow, FacultyRow, RoomRow, TimetableEntryRow } from "@/integrations/supabase/client";

// Convert database rows to application types
const mapCourseFromRow = (row: CourseRow): Course => ({
  id: row.id,
  name: row.name,
  code: row.code,
  enrollment: row.enrollment,
  description: row.description || "",
  durationHours: row.duration_hours
});

const mapFacultyFromRow = (row: FacultyRow): Faculty => ({
  id: row.id,
  name: row.name,
  email: row.email,
  department: row.department || "",
  specializations: row.specializations || []
});

const mapRoomFromRow = (row: RoomRow): Room => ({
  id: row.id,
  name: row.name,
  capacity: row.capacity,
  building: row.building || "",
  floor: row.floor || 1,
  hasProjector: row.has_projector || false,
  hasComputers: row.has_computers || false
});

// Load timetable data from Supabase
export const loadTimetableData = async () => {
  try {
    // Fetch courses
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*');
    
    if (coursesError) throw coursesError;
    
    // Fetch faculty
    const { data: facultyData, error: facultyError } = await supabase
      .from('faculty')
      .select('*');
    
    if (facultyError) throw facultyError;

    // Fetch rooms
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) throw roomsError;

    // Transform the data
    const courses = coursesData?.map(mapCourseFromRow) || [];
    const faculty = facultyData?.map(mapFacultyFromRow) || [];
    const rooms = roomsData?.map(mapRoomFromRow) || [];

    // Fetch existing timetable entries
    const { data: timetableData, error: timetableError } = await supabase
      .from('timetable_entries')
      .select('*');
    
    if (timetableError) throw timetableError;

    // Map timetable entries to include related objects
    const timetableEntries: TimetableEntry[] = timetableData?.map(entry => {
      const course = courses.find(c => c.id === entry.course_id);
      const facultyMember = faculty.find(f => f.id === entry.faculty_id);
      const room = rooms.find(r => r.id === entry.room_id);
      
      return {
        id: entry.id,
        courseId: entry.course_id,
        facultyId: entry.faculty_id,
        roomId: entry.room_id,
        timeSlotId: entry.time_slot_id,
        course: course,
        faculty: facultyMember,
        room: room
      };
    }) || [];

    const hasData = courses.length > 0 && faculty.length > 0 && rooms.length > 0;

    return {
      courses,
      faculty,
      rooms,
      timetableEntries,
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
      const entriesToInsert = newEntries.map(entry => ({
        id: entry.id,
        course_id: entry.courseId,
        faculty_id: entry.facultyId,
        room_id: entry.roomId,
        time_slot_id: entry.timeSlotId
      }));
      
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
      const entriesToInsert = timetableEntries.map(entry => ({
        id: entry.id,
        course_id: entry.courseId,
        faculty_id: entry.facultyId,
        room_id: entry.roomId,
        time_slot_id: entry.timeSlotId
      }));
      
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
    const facultyData = [
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
    const roomsData = [
      {
        name: "Room 101",
        capacity: 30,
        building: "Science Building",
        floor: 1,
        has_projector: true,
        has_computers: false
      },
      {
        name: "Room 202",
        capacity: 50,
        building: "Engineering Block",
        floor: 2,
        has_projector: true,
        has_computers: true
      },
      {
        name: "Lab A",
        capacity: 25,
        building: "Computer Lab",
        floor: 0,
        has_projector: true,
        has_computers: true
      },
      {
        name: "Room 303",
        capacity: 40,
        building: "Mathematics Wing",
        floor: 3,
        has_projector: true,
        has_computers: false
      },
      {
        name: "Seminar Hall",
        capacity: 100,
        building: "Main Admin Block",
        floor: 1,
        has_projector: true,
        has_computers: false
      }
    ];

    // Sample courses data
    const coursesData = [
      {
        name: "Introduction to Computer Science",
        code: "CS101",
        enrollment: 30,
        description: "Covers basics of programming, algorithms, and data structures.",
        duration_hours: 3
      },
      {
        name: "Linear Algebra for Engineers",
        code: "MATH204",
        enrollment: 40,
        description: "Focuses on vector spaces, matrices, and applications in engineering.",
        duration_hours: 2
      },
      {
        name: "Fundamentals of Artificial Intelligence",
        code: "AI301",
        enrollment: 35,
        description: "Introduction to AI concepts, search algorithms, and machine learning.",
        duration_hours: 3
      },
      {
        name: "Embedded Systems and IoT",
        code: "EE405",
        enrollment: 25,
        description: "Covers microcontrollers, IoT devices, and real-time operating systems.",
        duration_hours: 3
      },
      {
        name: "Thermodynamics",
        code: "ME210",
        enrollment: 50,
        description: "Fundamental concepts of heat, energy, and their engineering applications.",
        duration_hours: 2
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
