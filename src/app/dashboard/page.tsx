"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import { 
  Calendar, Users, FileText, Bell, Activity, CheckCircle, Clock, 
  AlertCircle, User, Search, Home, ChevronRight, Stethoscope
} from "lucide-react";



// Mock data for demo purposes - you would replace these with real data from your API
const mockNotifications = [
  { 
    id: "1", 
    message: "Your appointment with Dr. Smith has been confirmed", 
    type: "APPOINTMENT_CONFIRMED", 
    isRead: false, 
    createdAt: new Date(2025, 6, 10, 10, 30) 
  },
  { 
    id: "2", 
    message: "Dr. Johnson has requested to reschedule your appointment", 
    type: "SYSTEM", 
    isRead: true, 
    createdAt: new Date(2025, 6, 9, 14, 15) 
  },
  { 
    id: "3", 
    message: "New medical record has been uploaded", 
    type: "MEDICAL_RECORD_ADDED", 
    isRead: false,
    createdAt: new Date(2025, 6, 8, 9, 45) 
  },
];

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [userRole, setUserRole] = useState<"PATIENT" | "DOCTOR" | "ADMIN" | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);

  // Function to determine user role
  useEffect(() => {
    if (isLoaded && user) {
      // In a real app, you would fetch the role from your database
      const role = (user.unsafeMetadata?.role as string || "PATIENT").toUpperCase();
      setUserRole(role as "PATIENT" | "DOCTOR" | "ADMIN");
      
      // Demo purposes - fetch appointments based on role
      fetchAppointments(role);
    }
  }, [isLoaded, user]);

  const fetchAppointments = async (role: string) => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch real patient/doctor IDs
      const mockId = "user123";
      
      if (role === "PATIENT") {
        // Mock patient appointments data
        setAppointments([
          {
            id: "appt1",
            startTime: new Date(2025, 6, 14, 10, 0),
            endTime: new Date(2025, 6, 14, 10, 30),
            status: "CONFIRMED",
            doctor: {
              fullName: "Dr. Sarah Johnson",
              specialty: "NEUROLOGIST",
              profilePhoto: null
            }
          },
          {
            id: "appt2",
            startTime: new Date(2025, 6, 18, 14, 0),
            endTime: new Date(2025, 6, 18, 14, 30),
            status: "REQUESTED",
            doctor: {
              fullName: "Dr. Michael Chen",
              specialty: "CARDIOLOGIST",
              profilePhoto: null
            }
          }
        ]);
      } else if (role === "DOCTOR") {
        // Mock doctor appointments data
        const upcomingAppointments = [
          {
            id: "appt3",
            startTime: new Date(2025, 6, 13, 9, 0),
            endTime: new Date(2025, 6, 13, 9, 30),
            status: "CONFIRMED",
            patient: {
              fullName: "Jane Doe",
              gender: "FEMALE",
              dateOfBirth: new Date(1990, 5, 15)
            }
          },
          {
            id: "appt4",
            startTime: new Date(2025, 6, 13, 10, 0),
            endTime: new Date(2025, 6, 13, 10, 30),
            status: "CONFIRMED",
            patient: {
              fullName: "John Smith",
              gender: "MALE",
              dateOfBirth: new Date(1985, 3, 22)
            }
          }
        ];
        
        setAppointments(upcomingAppointments);
        
        // Set today's appointments for doctors
        setTodayAppointments([
          {
            id: "appt5",
            startTime: new Date(2025, 6, 12, 11, 0), // Today
            endTime: new Date(2025, 6, 12, 11, 30),
            status: "CONFIRMED",
            patient: {
              fullName: "Robert Johnson",
              gender: "MALE",
              dateOfBirth: new Date(1975, 8, 10)
            }
          }
        ]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "green";
      case "REQUESTED": return "blue";
      case "DECLINED": return "red";
      case "COMPLETED": return "purple";
      case "CANCELLED": return "orange";
      default: return "gray";
    }
  };

  // Format appointment date
  const formatAppointmentDate = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format specialty to be more readable
  const formatSpecialty = (specialty: string) => {
    return specialty
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT_CONFIRMED": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "APPOINTMENT_REQUEST": return <Clock className="h-5 w-5 text-blue-500" />;
      case "APPOINTMENT_DECLINED": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "APPOINTMENT_REMINDER": return <Bell className="h-5 w-5 text-yellow-500" />;
      case "MEDICAL_RECORD_ADDED": return <FileText className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  return (
    <div className="flex px-4 min-h-screen flex-col bg-muted/30 w-screen">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 md:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/telebridge-logo.svg"
              alt="TeleBridge Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
              }}
            />
            <span className="font-bold text-xl hidden md:inline-block">TeleBridge</span>
          </div>
          
          <div className="flex-1 mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search for doctors, specialties..."
                className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  onClick={() => {}}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </Button>
                
                {/* Notifications Dropdown */}
                <div className="relative group">
                  <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-80 p-2 rounded-lg border bg-background shadow-lg z-50">
                    <div className="flex justify-between items-center px-3 py-2 border-b">
                      <h4 className="font-medium">Notifications</h4>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        Mark all as read
                      </Button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto py-1">
                      {notifications.length === 0 ? (
                        <p className="text-center py-4 text-sm text-muted-foreground">No new notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <div 
                            key={notification.id}
                            className={`flex items-start gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer ${notification.isRead ? '' : 'bg-muted/30'}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${notification.isRead ? '' : 'font-medium'}`}>
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {format(notification.createdAt, 'MMM d, h:mm a')}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="pt-2 pb-1 px-3 border-t mt-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs justify-center hover:bg-muted"
                      >
                        View all notifications
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <SignedIn>
          <div className="px-4 md:px-8 py-6 md:py-8">
            {/* Mobile search */}
            <div className="md:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search..."
                  className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
            </div>

            {/* Page heading with breadcrumb */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center text-sm text-muted-foreground mb-1">
                <Home className="h-4 w-4 mr-1" />
                <ChevronRight className="h-4 w-4 mx-1" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Welcome, {user?.firstName || 'User'}</h1>
                {userRole === 'DOCTOR' && (
                  <Button onClick={() => router.push('/doctor-profile')}>
                    Update Profile
                  </Button>
                )}
                {userRole === 'PATIENT' && (
                  <Button onClick={() => router.push('/patient-profile')}>
                    Update Profile
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main content area */}
              <div className="col-span-1 md:col-span-8 space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {userRole === 'DOCTOR' ? 'Today\'s Patients' : 'Upcoming Appointments'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {userRole === 'DOCTOR' ? todayAppointments.length : appointments.length}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {userRole === 'DOCTOR' 
                          ? `${todayAppointments.length === 1 ? '1 patient' : `${todayAppointments.length} patients`} scheduled today` 
                          : `Next on ${appointments.length > 0 ? format(appointments[0]?.startTime, 'MMM d') : 'N/A'}`
                        }
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Card 2 */}
                  {userRole === 'DOCTOR' && (
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Total Patients
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">42</div>
                        <p className="text-sm text-muted-foreground">+3 new this month</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {userRole === 'PATIENT' && (
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          My Doctors
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">3</div>
                        <p className="text-sm text-muted-foreground">Specialists following you</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Card 3 */}
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Medical Records
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">8</div>
                      <p className="text-sm text-muted-foreground">Last updated 2 days ago</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Main content tabs */}
                <Tabs defaultValue="appointments" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="appointments">
                      {userRole === 'DOCTOR' ? 'Scheduled Appointments' : 'My Appointments'}
                    </TabsTrigger>
                    <TabsTrigger value="records">
                      {userRole === 'DOCTOR' ? 'Patient Records' : 'My Records'}
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Appointments Tab */}
                  <TabsContent value="appointments" className="space-y-4 pt-4">
                    {isLoading ? (
                      <p className="text-center py-8">Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg">No appointments</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          You don't have any upcoming appointments.
                        </p>
                        {userRole === 'PATIENT' && (
                          <Button onClick={() => router.push('/dashboard/doctors')}>
                            Find a Doctor
                          </Button>
                        )}
                      </div>
                    ) : (
                      <>
                        {userRole === 'DOCTOR' && todayAppointments.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="font-medium text-lg flex items-center gap-2">
                              <Activity className="h-4 w-4 text-red-500" />
                              Today's Appointments
                            </h3>
                            {todayAppointments.map((appointment) => (
                              <Card key={appointment.id} className="overflow-hidden">
                                <div className="flex items-center border-l-4 border-red-500 p-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarFallback>{appointment.patient.fullName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{appointment.patient.fullName}</p>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <span>{appointment.patient.gender}</span>
                                          <span className="mx-1">•</span>
                                          <span>{calculateAge(appointment.patient.dateOfBirth)} years</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline" className={`bg-${getStatusColor(appointment.status)}-100 text-${getStatusColor(appointment.status)}-700 border-${getStatusColor(appointment.status)}-200`}>
                                      {format(appointment.startTime, "h:mm a")}
                                    </Badge>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      {format(appointment.startTime, "MMM d, yyyy")}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            Upcoming Appointments
                          </h3>
                          {appointments.map((appointment) => (
                            <Card key={appointment.id} className="overflow-hidden">
                              <div className="flex items-center border-l-4 border-blue-500 p-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3">
                                    {userRole === 'PATIENT' ? (
                                      <>
                                        <Avatar className="h-10 w-10">
                                          <AvatarFallback>
                                            {appointment.doctor.fullName.split(' ').map((n: string) => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{appointment.doctor.fullName}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {formatSpecialty(appointment.doctor.specialty)}
                                          </p>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <Avatar className="h-10 w-10">
                                          <AvatarFallback>{appointment.patient.fullName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="font-medium">{appointment.patient.fullName}</p>
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <span>{appointment.patient.gender}</span>
                                            <span className="mx-1">•</span>
                                            <span>{calculateAge(appointment.patient.dateOfBirth)} years</span>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className={`bg-${getStatusColor(appointment.status)}-100 text-${getStatusColor(appointment.status)}-700 border-${getStatusColor(appointment.status)}-200`}>
                                    {appointment.status}
                                  </Badge>
                                  <div className="mt-1 text-xs">
                                    {format(appointment.startTime, "MMM d, yyyy")} • {format(appointment.startTime, "h:mm a")}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                          
                          <div className="text-center pt-3">
                            <Button variant="outline" onClick={() => router.push('/dashboard/appointments')}>
                              View All Appointments
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  {/* Records Tab */}
                  <TabsContent value="records" className="space-y-4 pt-4">
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">Medical records</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {userRole === 'DOCTOR' 
                          ? "Select a patient to view their records" 
                          : "Your medical records and documents will appear here"
                        }
                      </p>
                      {userRole === 'PATIENT' && (
                        <Button onClick={() => router.push('/dashboard/medical-records')}>
                          View Medical Records
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Sidebar */}
              <div className="col-span-1 md:col-span-4 space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {userRole === 'PATIENT' && (
                      <>
                        <Button className="justify-start" onClick={() => router.push('/dashboard/doctors')}>
                          <Search className="mr-2 h-4 w-4" />
                          Find a Specialist
                        </Button>
                        <Button className="justify-start" variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule an Appointment
                        </Button>
                        <Button className="justify-start" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Upload Medical Document
                        </Button>
                      </>
                    )}
                    {userRole === 'DOCTOR' && (
                      <>
                        <Button className="justify-start" onClick={() => router.push('/dashboard/appointments')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Manage Appointments
                        </Button>
                        <Button className="justify-start" variant="outline">
                          <Clock className="mr-2 h-4 w-4" />
                          Set Availability
                        </Button>
                        <Button className="justify-start" variant="outline">
                          <Users className="mr-2 h-4 w-4" />
                          View Patient List
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                {/* Notifications */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Notifications</CardTitle>
                      <Badge variant="secondary" className="h-6">
                        {notifications.filter(n => !n.isRead).length} new
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No notifications to display
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`flex items-start gap-2 p-3 rounded-md ${notification.isRead ? '' : 'bg-muted'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.isRead ? '' : 'font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(notification.createdAt, 'MMM d, h:mm a')}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full">
                      View All Notifications
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Resources or Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Health Resources</CardTitle>
                    <CardDescription>Helpful information and guidance</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Activity className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Telehealth Best Practices</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tips for getting the most out of your virtual consultations
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-green-100 p-2">
                        <FileText className="h-4 w-4 text-green-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Understanding Medical Terms</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          A guide to common medical terminology
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-purple-100 p-2">
                        <User className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Patient Rights & Privacy</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Information about your healthcare rights
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SignedIn>
        
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="max-w-md text-center px-4">
              <Image
                src="/telebridge-logo.svg"
                alt="TeleBridge Logo"
                width={80}
                height={80}
                className="mx-auto mb-6"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
                }}
              />
              <h1 className="text-3xl font-bold mb-4">Welcome to TeleBridge</h1>
              <p className="text-muted-foreground mb-8">
                Sign in to access your personalized dashboard and connect with healthcare specialists around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton mode="modal">
                  <Button variant="default" size="lg" className="w-full">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline" size="lg" className="w-full">
                    Create an account
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </SignedOut>
      </main>

      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/telebridge-logo.svg"
              alt="TeleBridge Logo"
              width={24}
              height={24}
              className="h-5 w-5"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
              }}
            />
            <span className="text-sm font-medium">TeleBridge</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TeleBridge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}