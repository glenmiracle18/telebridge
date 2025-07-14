"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Icons
import { 
  Calendar, Clock, Globe, Phone, Mail, Award,
  MapPin, GraduationCap, FileText, Star, ArrowLeft,
  ChevronRight, Home, Building, Languages
} from "lucide-react";

// Doctor actions
import { getDoctorById, getDoctorAvailability } from "@/lib/actions/doctor-actions";

export default function DoctorDetail() {
  const params = useParams();
  const router = useRouter();
  
  const doctorId = params.id as string;
  
  const [doctor, setDoctor] = useState<any>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Fetch doctor availability separately to ensure we have the most up-to-date data
        const { availability: availabilityData } = await getDoctorAvailability(doctorId);
        setAvailability(availabilityData || []);
        
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor information');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDoctor();
  }, [doctorId]);

  // Format specialty to be more readable
  const formatSpecialty = (specialty: string) => {
    if (!specialty) return '';
    return specialty
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  // Convert day number to day name
  const getDayName = (dayNumber: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNumber];
  };
  
  // Format availability schedule for display
  const formatAvailabilitySchedule = () => {
    if (!availability || availability.length === 0) {
      return [];
    }
    
    // Group availability by day of week
    const groupedByDay: { [key: number]: any[] } = {};
    
    availability.forEach(slot => {
      if (!groupedByDay[slot.dayOfWeek]) {
        groupedByDay[slot.dayOfWeek] = [];
      }
      groupedByDay[slot.dayOfWeek].push(slot);
    });
    
    // Convert to array of day objects with time slots
    return Object.entries(groupedByDay).map(([day, slots]) => {
      return {
        dayNumber: parseInt(day),
        dayName: getDayName(parseInt(day)),
        slots: slots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
      };
    }).sort((a, b) => a.dayNumber - b.dayNumber);
  };
  
  const schedule = formatAvailabilitySchedule();

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
        <span className="text-foreground font-medium">
          {doctor.fullName}
        </span>
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
      
      {/* Doctor profile header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={doctor.profilePhoto || ""} alt={doctor.fullName} />
                <AvatarFallback className="text-2xl">
                  {doctor.fullName.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{doctor.fullName}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-sm py-1">
                    {formatSpecialty(doctor.specialty)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Award className="h-3.5 w-3.5 mr-1" />
                    <span>{doctor.yearsOfExperience} years experience</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex gap-4 pt-2">
                  <Button onClick={() => router.push(`/dashboard/doctors/${doctorId}/book`)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick info card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Consultation Fee</span>
              </div>
              <span className="font-semibold">RWF {doctor.consultationFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Session Duration</span>
              </div>
              <span className="font-semibold">30 minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Languages className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Languages</span>
              </div>
              <span className="font-semibold">{doctor.languagesSpoken}</span>
            </div>
            <Separator />
            <div className="pt-2">
              <Button 
                className="w-full" 
                onClick={() => router.push(`/dashboard/doctors/${doctorId}/book`)}
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Doctor details tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
        </TabsList>
        
        {/* About tab */}
        <TabsContent value="about" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{doctor.bio || "No biography available."}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctor.user?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span>{doctor.user.email}</span>
                    </div>
                  )}
                  {doctor.user?.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{doctor.user.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span>{doctor.hospital}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Specialization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1">
                      {formatSpecialty(doctor.specialty)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Specialized in treating patients with various conditions related to {formatSpecialty(doctor.specialty).toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Schedule tab */}
        <TabsContent value="schedule" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                The doctor's regular availability for appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No availability schedule found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schedule.map((day) => (
                    <Card key={day.dayNumber} className="overflow-hidden">
                      <div className="bg-primary text-primary-foreground py-2 px-4">
                        <h3 className="font-medium">{day.dayName}</h3>
                      </div>
                      <CardContent className="pt-4">
                        {day.slots.map((slot, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <div className="flex justify-center mt-6">
                <Button onClick={() => router.push(`/dashboard/doctors/${doctorId}/book`)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book an Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Qualifications tab */}
        <TabsContent value="qualifications" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doctor.education || "Educational background not available"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Professional Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{doctor.qualifications || "Professional qualifications not available"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}