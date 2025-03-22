
import React from "react";

const GoogleCalendarView: React.FC = () => {
  return (
    <>
      <div className="flex justify-center p-4 overflow-x-auto">
        <iframe 
          src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FKolkata&src=MmFiZDkxYWZmYjc5NDQwYWEzOWIxOGQ0YzBhNzhiYTRhZTFmMmRiZTRjMDNjZTRlNDZjOTQwMTgwNjUyYTliYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZW4uaW5kaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%239E69AF&color=%230B8043" 
          style={{ border: "solid 1px #777" }} 
          width="100%" 
          height="600" 
          frameBorder="0" 
          scrolling="no"
          title="Google Calendar"
          className="max-w-full rounded-lg shadow-md"
        />
      </div>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>View and integrate with Google Calendar</p>
      </div>
    </>
  );
};

export default GoogleCalendarView;
