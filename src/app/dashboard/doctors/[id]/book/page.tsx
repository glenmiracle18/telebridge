"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, addDays, isSameDay } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Icons
import { 
  Calendar as CalendarIcon, ChevronRight, Clock, Home,
  ArrowLeft, CheckCircle, AlertCircle, X 
} from "lucide-react";

// Doctor and appointment actions
import { getDoctorById } from "@/lib/actions/doctor-actions";
import { getDoctorAvailabilityForDate, createAppointment } from "@/lib/actions/appointment-actions";
import { getFirstPatient } from "@/lib/actions/patient-actions";
import { useUser } from "@clerk/nextjs";

export default function BookAppointment() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  const doctorId = params.id as string;
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);

  // Format specialty to be more readable
  const formatSpecialty = (specialty: string) => {
    if (!specialty) return '';
    return specialty
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  // Fetch doctor details
  useEffect(() => {
    async function fetchDoctor() {
      setLoading(true);
      try {
        // Fetch doctor details
        const { doctor: doctorData, error: doctorError } = await getDoctorById(doctorId);
        
        if (doctorError) {
          setError(doctorError);
          return;
        }
        
        setDoctor(doctorData);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor information');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDoctor();
  }, [doctorId]);

  // Fetch patient ID when user is loaded
  useEffect(() => {
    async function fetchPatientId() {
      if (isLoaded) {
        try {
          // For demo purposes, we'll use the seeded patient
          // In a real app, you would use the Clerk ID to fetch the patient ID
          const { patient, error } = await getFirstPatient();
          
          if (error) {
            console.error('Error fetching patient:', error);
            setError('Failed to load patient information');
            return;
          }
          
          if (patient) {
            console.log('Using patient ID:', patient.id);
            setPatientId(patient.id);
          }
        } catch (err) {
          console.error('Error fetching patient ID:', err);
          setError('Failed to load patient information');
        }
      }
    }
    
    fetchPatientId();
  }, [isLoaded]);

  // Fetch available slots when date is selected
  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedDate || !doctorId) return;
      
      try {
        const { availableSlots: slots, error } = await getDoctorAvailabilityForDate(doctorId, selectedDate);
        
        if (error) {
          console.error(error);
          setAvailableSlots([]);
          return;
        }
        
        setAvailableSlots(slots || []);
        setSelectedSlot(null); // Reset selected slot when date changes
      } catch (err) {
        console.error('Error fetching availability:', err);
        setAvailableSlots([]);
      }
    }
    
    fetchAvailability();
  }, [selectedDate, doctorId]);

  const handleBookAppointment = async () => {
    if (!selectedSlot || !patientId || !doctorId) {
      setBookingError('Please select a time slot');
      return;
    }

    setBookingStatus('loading');
    
    try {
      const { appointment, error } = await createAppointment({
        patientId,
        doctorId,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        notes: notes.trim() || undefined
      });
      
      if (error) {
        setBookingError(error);
        setBookingStatus('error');
        return;
      }
      
      setBookingStatus('success');
      setTimeout(() => {
        router.push('/dashboard/appointments');
      }, 2000);
      
    } catch (err) {
      console.error('Error booking appointment:', err);
      setBookingError('Failed to book appointment. Please try again.');
      setBookingStatus('error');
    }
  };

  const disabledDays = {
    before: new Date(),
    after: addDays(new Date(), 30), // Only allow booking 30 days in advance
  };

  // Format time slot for display
  const formatTimeSlot = (slot: any) => {
    return `${format(slot.start, 'h:mm a')} - ${format(slot.end, 'h:mm a')}`;
  };

  if (loading) {
    return (
      <div className="px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-20 w-20 bg-muted rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-muted rounded mb-4"></div>
            <div className="h-4 w-64 bg-muted rounded mb-4"></div>
            <div className="h-4 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Doctor not found'}</p>
          <Button onClick={() => router.push('/dashboard/doctors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb navigation */}
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="hover:text-foreground flex items-center">
          <Home className="h-4 w-4 mr-1" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/dashboard/doctors" className="hover:text-foreground">
          Doctors
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link 
          href={`/dashboard/doctors/${doctorId}`} 
          className="hover:text-foreground"
        >
          {doctor.fullName}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground font-medium">Book Appointment</span>
      </div>
      
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select a Date and Time</CardTitle>
              <CardDescription>
                Choose a date and time that works for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingStatus === 'success' ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Appointment Requested</h3>
                  <p className="text-muted-foreground mb-4">
                    Your appointment request has been submitted. You will receive a notification
                    when the doctor confirms your appointment.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to your appointments...
                  </p>
                </div>
              ) : (
                <>
                  {/* Calendar */}
                  <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Select a Date
                        </label>
                        <div className="border rounded-md p-4">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={disabledDays}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Available Time Slots
                        </label>
                        <div className="border rounded-md p-4 h-[300px] overflow-auto">
                          {!selectedDate ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">
                                Please select a date first
                              </p>
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">
                                No available slots for this date
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {availableSlots.map((slot, idx) => (
                                <div
                                  key={idx}
                                  className={`
                                    border rounded-md p-2 text-center cursor-pointer hover:border-primary transition-colors
                                    ${selectedSlot && isSameDay(selectedSlot.start, slot.start) && format(selectedSlot.start, 'HH:mm') === format(slot.start, 'HH:mm') 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-background'}
                                  `}
                                  onClick={() => setSelectedSlot(slot)}
                                >
                                  <div className="text-sm font-medium">
                                    {formatTimeSlot(slot)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Notes for the Doctor (Optional)
                    </label>
                    <Textarea
                      placeholder="Describe your symptoms or reason for consultation..."
                      className="h-24"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  
                  {/* Error message */}
                  {bookingStatus === 'error' && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <div>{bookingError}</div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookAppointment}
                disabled={!selectedSlot || bookingStatus === 'loading' || bookingStatus === 'success'}
                className={bookingStatus === 'loading' ? 'opacity-80' : ''}
              >
                {bookingStatus === 'loading' ? 'Booking...' : 'Book Appointment'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Doctor summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={doctor.profilePhoto || ""} alt={doctor.fullName} />
                  <AvatarFallback className="text-lg">
                    {doctor.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{doctor.fullName}</h3>
                  <Badge variant="secondary">
                    {formatSpecialty(doctor.specialty)}
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consultation Fee</span>
                  <span className="font-medium">${doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">30 minutes</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Time</h4>
                {selectedDate && selectedSlot ? (
                  <div className="bg-muted/50 p-3 rounded-md text-sm">
                    <div className="font-medium">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="text-muted-foreground">
                      {formatTimeSlot(selectedSlot)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No time selected yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Booking information */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="font-medium">Step 1:</span> Select a date and time slot.
              </p>
              <p>
                <span className="font-medium">Step 2:</span> Add optional notes about your condition.
              </p>
              <p>
                <span className="font-medium">Step 3:</span> Submit your booking request.
              </p>
              <div className="bg-blue-50 text-blue-800 p-3 rounded-md mt-4">
                <p className="font-medium mb-1">Important:</p>
                <p>
                  Your appointment will be pending until confirmed by the doctor.
                  You will receive a notification when your appointment is confirmed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}