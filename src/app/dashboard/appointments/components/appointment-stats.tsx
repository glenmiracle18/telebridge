"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { AppointmentStatus } from "@prisma/client";
import { getFirstPatient } from "@/lib/actions/patient-actions";
import { getPatientAppointments } from "@/lib/actions/appointment-actions";

// Define the appointment type consistent with other components
interface Appointment {
  id: string;
  status: AppointmentStatus;
  startTime: Date;
  endTime: Date;
}

export function AppointmentStats() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        // In a real app, this would use the current user's patient ID
        const { patient } = await getFirstPatient();
        if (patient) {
          const result = await getPatientAppointments(patient.id);
          if (result.appointments) {
            setAppointments(result.appointments as Appointment[]);
          }
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  // Count appointments by status
  const confirmedCount = appointments.filter(
    appt => appt.status === "CONFIRMED"
  ).length;
  
  const requestedCount = appointments.filter(
    appt => appt.status === "REQUESTED"
  ).length;
  
  const completedCount = appointments.filter(
    appt => appt.status === "COMPLETED"
  ).length;
  
  const cancelledCount = appointments.filter(
    appt => appt.status === "CANCELLED" || appt.status === "DECLINED"
  ).length;

  const statsCards = [
    {
      title: "Total Appointments",
      value: appointments.length,
      description: "All time",
      icon: <CalendarIcon className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Confirmed",
      value: confirmedCount,
      description: "Upcoming",
      icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Requested",
      value: requestedCount,
      description: "Pending confirmation",
      icon: <ClockIcon className="h-4 w-4 text-yellow-500" />,
    },
    {
      title: "Cancelled",
      value: cancelledCount,
      description: "Including declined",
      icon: <XCircleIcon className="h-4 w-4 text-red-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <CardDescription>Please wait</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {statsCards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {card.icon}
              {card.title}
            </CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}