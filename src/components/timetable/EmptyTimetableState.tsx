
import React from "react";
import { Link } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { CalendarClock, ArrowRight } from "lucide-react";

interface EmptyTimetableStateProps {
  hasData: boolean;
}

const EmptyTimetableState: React.FC<EmptyTimetableStateProps> = ({ hasData }) => {
  return (
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
  );
};

export default EmptyTimetableState;
