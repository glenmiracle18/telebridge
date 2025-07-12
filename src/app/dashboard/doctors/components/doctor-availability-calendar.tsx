'use client';

import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

interface DoctorAvailabilityCalendarProps {
  doctorId: string;
  availabilityByDay: Record<string, string[]>;
}

export default function DoctorAvailabilityCalendar({
  doctorId,
  availabilityByDay,
}: DoctorAvailabilityCalendarProps) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysOfWeek.map((day) => {
          const slots = availabilityByDay[day] || [];
          const hasSlots = slots.length > 0;
          
          return (
            <div 
              key={day} 
              className={`p-4 border rounded-lg ${hasSlots ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{day}</h3>
                {hasSlots ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-500">
                    Unavailable
                  </Badge>
                )}
              </div>
              
              {hasSlots ? (
                <ul className="space-y-1 text-sm">
                  {slots.map((slot, index) => (
                    <li key={index} className="text-muted-foreground">
                      {slot}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No availability</p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-6">
        <Link 
          href={`/dashboard/doctors/${doctorId}/book`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <Calendar className="h-4 w-4" />
          <span>Book an appointment</span>
        </Link>
      </div>
    </div>
  );
} 