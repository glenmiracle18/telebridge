'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { createAppointment } from '@/lib/actions/appointment-actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Doctor, User } from '@prisma/client';
import { format, addMinutes, isBefore, isAfter, setHours, setMinutes, parse } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useUser } from '@clerk/nextjs';
import { Calendar } from '@/components/ui/calender';

type DoctorWithUser = Doctor & {
  user: Pick<User, 'email' | 'phoneNumber'>;
  availabilities: {
    id: string;
    doctorId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const formSchema = z.object({
  appointmentDate: z.date({
    error: 'Please select a date for your appointment',
  }),
  appointmentTime: z.string({
    error: 'Please select a time for your appointment',
  }),
  notes: z.string().optional(),
});

export default function AppointmentBookingForm({ doctor }: { doctor: DoctorWithUser }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { user } = useUser();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
    },
  });

  // Get available days of the week
  const availableDays = doctor.availabilities.map(a => a.dayOfWeek);

  // Function to check if a date is available based on doctor's availability
  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availableDays.includes(dayOfWeek);
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const availableSlots = doctor.availabilities.filter(a => a.dayOfWeek === dayOfWeek);
    
    const timeSlots: string[] = [];
    availableSlots.forEach(slot => {
      const startTime = parse(slot.startTime, 'HH:mm', new Date());
      const endTime = parse(slot.endTime, 'HH:mm', new Date());
      
      let currentTime = startTime;
      while (isBefore(currentTime, endTime)) {
        timeSlots.push(format(currentTime, 'HH:mm'));
        currentTime = addMinutes(currentTime, 30); // 30-minute slots
      }
    });
    
    return timeSlots;
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast.error('You need to be signed in to book an appointment');
      return;
    }

    const [hours, minutes] = data.appointmentTime.split(':').map(Number);
    const startTime = new Date(data.appointmentDate);
    startTime.setHours(hours, minutes, 0, 0);
    
    const endTime = addMinutes(startTime, 30);

    startTransition(async () => {
      try {
        // In a real app, you would get the patient ID from the current user
        // For now, we'll use a placeholder
        const patientId = 'patient_id_placeholder';
        
        const result = await createAppointment({
          patientId,
          doctorId: doctor.id,
          startTime,
          endTime,
          notes: data.notes,
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Appointment requested successfully');
          router.push('/dashboard/appointments');
        }
      } catch (error) {
        toast.error('Failed to book appointment');
      }
    });
  };

  const selectedDate = form.watch('appointmentDate');
  const availableTimeSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="appointmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        isBefore(date, new Date()) || // Disable past dates
                        !isDateAvailable(date) // Disable dates where doctor is not available
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select a date for your appointment
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <Select
                  disabled={!selectedDate || availableTimeSlots.length === 0}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {selectedDate
                    ? availableTimeSlots.length > 0
                      ? 'Select an available time slot'
                      : 'No available time slots for this date'
                    : 'First select a date'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional information about your appointment"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Provide any details about your condition or reason for the appointment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Booking...' : 'Book Appointment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Select component for time selection
function Select({
  children,
  disabled,
  onValueChange,
  value,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  value?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full justify-between',
            !value && 'text-muted-foreground',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={disabled}
        >
          {value || 'Select a time'}
          <Clock className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-y-auto">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-2">
      {children}
    </div>
  );
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start font-normal"
      onClick={() => {
        // This would be handled by the parent component
      }}
    >
      {children}
    </Button>
  );
}

function SelectTrigger({ children }: { children: React.ReactNode }) {
  return children;
}

function SelectValue({ placeholder }: { placeholder: string }) {
  return <span>{placeholder}</span>;
} 