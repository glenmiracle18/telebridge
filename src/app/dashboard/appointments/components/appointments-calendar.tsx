"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calender";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentDialog } from "./appointment-dialog";
import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { getFirstPatient } from "@/lib/actions/patient-actions";
import { getPatientAppointments } from "@/lib/actions/appointment-actions";
import { AppointmentStatus, Specialty } from "@prisma/client";

// Define appointment type (same as in appointment-list.tsx)
interface Doctor {
  id: string;
  fullName: string;
  specialty: string;
  profilePhoto: string | null;
  bio?: string;
}

interface Patient {
  id: string;
  fullName: string;
  gender: string;
  dateOfBirth: Date;
}

export interface AppointmentType {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string | null;
  location?: string;
  doctor?: Doctor;
  patient?: Patient;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentsCalendarProps {
  appointments: AppointmentType[];
  userRole: "DOCTOR" | "PATIENT" | "ADMIN";
}

export function AppointmentsCalendar({ appointments, userRole }: AppointmentsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  // Format specialty to be more readable
  const formatSpecialty = (specialty: string) => {
    return specialty
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  // Get dates with appointments for highlighting in calendar
  const getAppointmentDates = () => {
    const dates = appointments.map(appointment => {
      const date = new Date(appointment.startTime);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });
    
    return dates;
  };

  // Filter appointments for the selected date
  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return isSameDay(appointmentDate, selectedDate);
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  // Get appointment counts for each date
  const appointmentCountByDate = appointments.reduce((acc, appointment) => {
    const date = format(new Date(appointment.startTime), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Handle appointment click
  const handleAppointmentClick = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  // Get appointments for the selected date
  const appointmentsForSelectedDate = getAppointmentsForSelectedDate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              appointment: getAppointmentDates(),
            }}
            modifiersStyles={{
              appointment: { 
                fontWeight: 'bold',
                backgroundColor: 'rgba(var(--primary), 0.1)',
                color: 'var(--primary)' 
              }
            }}
            components={{
              Day: (props) => {
                const dateKey = format(props.day.date, 'yyyy-MM-dd');
                const count = appointmentCountByDate[dateKey];
                
                return (
                  <div className="relative h-full w-full p-2 flex items-center justify-center">
                    <span>{props.day.date.getDate()}</span>
                    {count > 0 && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex h-1.5 w-1.5 items-center justify-center rounded-full bg-primary">
                      </span>
                    )}
                  </div>
                );
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? (
              <>Appointments for {format(selectedDate, 'MMMM d, yyyy')}</>
            ) : (
              <>Select a date</>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {appointmentsForSelectedDate.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No appointments for this date
                </p>
              </div>
            ) : (
              appointmentsForSelectedDate.map((appointment, index) => (
                <Dialog key={appointment.id} open={dialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={(open) => !open && setDialogOpen(false)}>
                  <DialogTrigger asChild>
                    <motion.div 
                      className="cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <Card className={`border-l-4 border-${getStatusColor(appointment.status)}-500 hover:shadow-md transition-shadow`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {userRole === "PATIENT" ? (
                                <div>
                                  <p className="font-medium">Dr. {appointment.doctor?.fullName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatSpecialty(appointment.doctor?.specialty || "")}
                                  </p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium">{appointment.patient?.fullName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Patient
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <Badge variant="outline" className={`bg-${getStatusColor(appointment.status)}-100 text-${getStatusColor(appointment.status)}-700 border-${getStatusColor(appointment.status)}-200`}>
                                {appointment.status}
                              </Badge>
                              <p className="text-sm mt-1">
                                {format(appointment.startTime, "h:mm a")} - {format(appointment.endTime, "h:mm a")}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>
                  {selectedAppointment && (
                    <AppointmentDialog 
                      appointment={selectedAppointment} 
                      open={dialogOpen && selectedAppointment?.id === appointment.id}
                      onOpenChange={(open) => setDialogOpen(open)}
                      userRole={userRole}
                    />
                  )}
                </Dialog>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}