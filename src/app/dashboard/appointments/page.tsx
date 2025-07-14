"use client";

import { Suspense, useState } from "react";
import { CalendarIcon, ClockIcon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentStats } from "./components/appointment-stats";
import { AppointmentFilters } from "./components/appointment-filters";
import { AppointmentList } from "./components/appointment-list";
import { AppointmentsCalendar } from "./components/appointments-calendar";
import LoadingAppointments from "./components/loading-appointments";
import { getPatientAppointments, getDoctorAppointments } from "@/lib/actions/appointment-actions";
import { AppointmentType } from "./components/appointments-calendar";

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<"DOCTOR" | "PATIENT" | "ADMIN" | null>(null);

  // Get user role from Clerk metadata
  const { data: userData } = useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      if (!isLoaded || !user) return null;
      
      // Get the role from user metadata
      const role = (user.unsafeMetadata?.role as string || "PATIENT").toUpperCase();
      setUserRole(role as "DOCTOR" | "PATIENT" | "ADMIN");
      
      return { 
        role: role as "DOCTOR" | "PATIENT" | "ADMIN", 
        userId: user.id 
      };
    },
    enabled: isLoaded && !!user,
  });

  // Fetch patient appointments
  const { data: patientAppointmentsData, isLoading: isLoadingPatientAppointments } = useQuery({
    queryKey: ["patient-appointments", userData?.userId],
    queryFn: async () => {
      // In a real app, you would use the actual patient ID
      const userId = "user123"; // Placeholder
      const { appointments, error } = await getPatientAppointments(userId);
      
      if (error) {
        throw new Error(error);
      }
      
      return appointments;
    },
    enabled: !!userData && userData.role === "PATIENT",
  });

  // Fetch doctor appointments
  const { data: doctorAppointmentsData, isLoading: isLoadingDoctorAppointments } = useQuery({
    queryKey: ["doctor-appointments", userData?.userId],
    queryFn: async () => {
      // In a real app, you would use the actual doctor ID
      const userId = "user123"; // Placeholder
      const { appointments, error } = await getDoctorAppointments(userId);
      
      if (error) {
        throw new Error(error);
      }
      
      return appointments;
    },
    enabled: !!userData && userData.role === "DOCTOR",
  });

  // Determine which appointments to show based on user role
  const appointments = userRole === "DOCTOR" ? doctorAppointmentsData : patientAppointmentsData;
  const isLoading = 
    !isLoaded || 
    (userRole === "DOCTOR" && isLoadingDoctorAppointments) || 
    (userRole === "PATIENT" && isLoadingPatientAppointments);

  return (
    <div className="p-8 flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming telemedicine appointments
        </p>
      </div>

      <AppointmentStats />

      <Tabs defaultValue="list" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>List View</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar View</span>
            </TabsTrigger>
          </TabsList>
          
          <AppointmentFilters />
        </div>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
              <CardDescription>
                View all your scheduled appointments with specialists
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense fallback={<LoadingAppointments />}>
                {isLoading ? (
                  <LoadingAppointments />
                ) : (
                  <AppointmentList 
                    appointments={appointments as any[]}
                    userRole={userRole || "PATIENT"}
                    isLoading={isLoading}
                  />
                )}
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointments Calendar</CardTitle>
              <CardDescription>
                Calendar view of all your scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingAppointments />}>
                {isLoading ? (
                  <LoadingAppointments />
                ) : (
                  <AppointmentsCalendar 
                    appointments={appointments as AppointmentType[]} 
                    userRole={userRole || "PATIENT"} 
                  />
                )}
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}