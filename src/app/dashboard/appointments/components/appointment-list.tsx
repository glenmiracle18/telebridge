"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { format, isPast } from "date-fns";
import { 
  ChevronRightIcon, 
  ClockIcon, 
  CalendarIcon, 
  AlertCircleIcon, 
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { AppointmentStatus, Specialty } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPatientAppointments } from "@/lib/actions/appointment-actions";
import { getFirstPatient } from "@/lib/actions/patient-actions";
import { AppointmentDialog } from "./appointment-dialog";

// Define appointment status types and their UI properties
const statusConfig = {
  REQUESTED: {
    label: "Requested",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: <AlertCircleIcon className="h-4 w-4 text-yellow-500 mr-1" />,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />,
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    icon: <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />,
  },
  DECLINED: {
    label: "Declined",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    icon: <XCircleIcon className="h-4 w-4 text-gray-500 mr-1" />,
  },
};

// Define appointment type
interface Doctor {
  id: string;
  fullName: string;
  specialty: Specialty;
  profilePhoto: string | null;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string | null;
  doctor: Doctor;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppointmentListProps {
  appointments?: Appointment[];
  userRole?: "DOCTOR" | "PATIENT" | "ADMIN";
  isLoading?: boolean;
}

export function AppointmentList({ appointments: propAppointments = [], userRole = "PATIENT", isLoading: propLoading = false }: AppointmentListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  if (propLoading) {
    return <AppointmentListSkeleton />;
  }

  if (propAppointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-primary/10 p-3 mb-4">
          <CalendarIcon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">No appointments yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          You don't have any scheduled appointments. Book an appointment with a specialist to get started.
        </p>
        <Button asChild>
          <a href="/dashboard/doctors">Find a Specialist</a>
        </Button>
      </div>
    );
  }

  // Sort appointments by date (upcoming first, then past)
  const sortedAppointments = [...propAppointments].sort((a, b) => {
    const aDate = new Date(a.startTime);
    const bDate = new Date(b.startTime);
    return aDate.getTime() - bDate.getTime();
  });

  // Separate upcoming and past appointments
  const upcomingAppointments = sortedAppointments.filter(
    (appointment) => !isPast(new Date(appointment.startTime))
  );
  
  const pastAppointments = sortedAppointments.filter(
    (appointment) => isPast(new Date(appointment.startTime))
  );

  return (
    <div>
      {selectedAppointment && (
      <AppointmentDialog
        userRole={"PATIENT"}
        appointment={selectedAppointment}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      )}

      {upcomingAppointments.length > 0 && (
      <>
        <div className="px-6 py-3 bg-muted/40">
        <h3 className="font-medium">Upcoming Appointments</h3>
        </div>
        <div className="divide-y">
        {upcomingAppointments.map((appointment) => (
          <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          onClick={() => handleAppointmentClick(appointment)}
          />
        ))}
        </div>
      </>
      )}

      {pastAppointments.length > 0 && (
      <>
        <div className="px-6 py-3 bg-muted/40">
        <h3 className="font-medium">Past Appointments</h3>
        </div>
        <div className="divide-y">
        {pastAppointments.map((appointment) => (
          <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          onClick={() => handleAppointmentClick(appointment)}
          />
        ))}
        </div>
      </>
      )}
    </div>
  );
}

interface AppointmentItemProps {
  appointment: Appointment;
  onClick: () => void;
}

function AppointmentItem({ appointment, onClick }: AppointmentItemProps) {
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  
  const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.REQUESTED;
  const isPastAppointment = isPast(startTime);

  return (
    <div 
      className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage 
              src={appointment.doctor.profilePhoto || ""} 
              alt={appointment.doctor.fullName} 
            />
            <AvatarFallback>
              {appointment.doctor.fullName.split(' ')
                .map((name: string) => name[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h4 className="text-base font-medium">Dr. {appointment.doctor.fullName}</h4>
            <p className="text-sm text-muted-foreground">
              {appointment.doctor.specialty.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Badge variant="outline" className={status.color}>
            <span className="flex items-center">
              {status.icon}
              {status.label}
            </span>
          </Badge>
          <ChevronRightIcon className="h-5 w-5 text-muted-foreground ml-2" />
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="mr-1 h-4 w-4" />
          <span>{format(startTime, "EEEE, MMMM d, yyyy")}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <ClockIcon className="mr-1 h-4 w-4" />
          <span>
            {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
}

function AppointmentListSkeleton() {
  return (
    <div className="divide-y">
      {[1, 2, 3].map((item) => (
        <div className="p-4" key={item}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="mt-3 flex gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
