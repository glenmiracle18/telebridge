"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Video,
  Calendar as CalendarIcon
} from "lucide-react";
import { AppointmentStatus, Specialty } from "@prisma/client";

import { cancelAppointment } from "@/lib/actions/appointment-actions";
import { toast } from "sonner";
import { AppointmentType } from "./appointments-calendar";

// Import the Doctor and Appointment types from appointment-list.tsx
interface Doctor {
  fullName: string;
  specialty: Specialty;
  profilePhoto: string | null;
  bio?: string;
}

interface AppointmentDialogProps {
  appointment: AppointmentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: "DOCTOR" | "PATIENT" | "ADMIN";
}

const statusConfig = {
  REQUESTED: {
    label: "Requested",
    badgeClass: "bg-yellow-100 text-yellow-800",
  },
  CONFIRMED: {
    label: "Confirmed",
    badgeClass: "bg-green-100 text-green-800",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-800",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-blue-100 text-blue-800",
  },
  DECLINED: {
    label: "Declined",
    badgeClass: "bg-gray-100 text-gray-800",
  },
};

export function AppointmentDialog({ appointment, open, onOpenChange, userRole }: AppointmentDialogProps) {
  const [notes, setNotes] = useState(appointment.notes || "");
  const [saving, setSaving] = useState(false);
  const [confirmingAction, setConfirmingAction] = useState<"cancel" | "reschedule" | null>(null);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REQUESTED": return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "DECLINED": return <XCircle className="h-5 w-5 text-red-500" />;
      case "COMPLETED": return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case "CANCELLED": return <XCircle className="h-5 w-5 text-orange-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
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

  const handleSaveNotes = async () => {
    setSaving(true);
    // In a real app, this would call your API to save the notes
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Mock API call
      console.log("Saving notes:", notes);
      // Success feedback would be added here
    } catch (error) {
      console.error("Error saving notes:", error);
      // Error feedback would be added here
    } finally {
      setSaving(false);
    }
  };

  const handleCancelAppointment = async () => {
    setConfirmingAction("cancel");
    // This would show the confirmation UI
  };

  const handleConfirmAction = async () => {
    if (confirmingAction === "cancel") {
      // In a real app, this would call your API to cancel the appointment
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Mock API call
        console.log("Cancelling appointment:", appointment.id);
        // Would close dialog or update UI accordingly
        if (onOpenChange) onOpenChange(false);
      } catch (error) {
        console.error("Error cancelling appointment:", error);
      } finally {
        setConfirmingAction(null);
      }
    }
  };

  // Format date for display
  const appointmentDate = format(appointment.startTime, "EEEE, MMMM d, yyyy");
  const appointmentTime = `${format(appointment.startTime, "h:mm a")} - ${format(appointment.endTime, "h:mm a")}`;

  const isUpcoming = new Date(appointment.startTime) > new Date();
  const isPast = !isUpcoming;
  const canModify = isUpcoming && appointment.status !== "CANCELLED" && appointment.status !== "DECLINED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getStatusIcon(appointment.status)}
            <DialogTitle className="text-xl">
              {userRole === "PATIENT" ? "Appointment with Doctor" : "Patient Appointment"}
            </DialogTitle>
          </div>
          <DialogDescription>
            <Badge variant="outline" className={`bg-${getStatusColor(appointment.status)}-100 text-${getStatusColor(appointment.status)}-700 border-${getStatusColor(appointment.status)}-200`}>
              {appointment.status}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Appointment Details</TabsTrigger>
            <TabsTrigger value="notes">Notes & Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 py-4">
            {/* Person info */}
            {userRole === "PATIENT" ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={appointment.doctor?.profilePhoto || ""} />
                  <AvatarFallback>
                    {appointment.doctor?.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">Dr. {appointment.doctor?.fullName}</h3>
                  <p className="text-muted-foreground">
                    {formatSpecialty(appointment.doctor?.specialty || "")}
                  </p>
                  {appointment.doctor?.specialty && (
                    <p className="text-sm mt-2 max-w-lg">{appointment.doctor.bio}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{appointment.patient?.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">{appointment.patient?.fullName}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <span>{appointment.patient?.gender}</span>
                    <span className="mx-1">•</span>
                    <span>{calculateAge(appointment.patient?.dateOfBirth!)} years</span>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Appointment details */}
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-muted-foreground">{appointmentDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-muted-foreground">{appointmentTime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-muted-foreground">
                    {appointment.location ? (appointment.location === "ONLINE" ? "Virtual Appointment" : "Office Visit") : "Office Visit"}
                  </p>
                </div>
              </div>
              
              {appointment.status === "CONFIRMED" && (appointment.location === "ONLINE" || !appointment.location) && (
                <Button 
                  className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
                  disabled={isPast}
                >
                  <Video className="mr-2 h-4 w-4" />
                  {isPast ? "Video session ended" : "Join Video Session"}
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-6 py-4">
            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Appointment Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this appointment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-32"
                  readOnly={!canModify || userRole !== "DOCTOR"}
                />
                {userRole === "DOCTOR" && canModify && (
                  <Button 
                    onClick={handleSaveNotes} 
                    disabled={saving} 
                    className="ml-auto"
                    size="sm"
                  >
                    {saving ? "Saving..." : "Save Notes"}
                  </Button>
                )}
              </div>
              
              <Separator className="my-4" />

              {/* Medical records section */}
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <h4 className="font-medium mb-1">Medical Records</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {userRole === "PATIENT" 
                    ? "Access or upload your medical records related to this appointment." 
                    : "Access patient medical records related to this appointment."
                  }
                </p>
                <Button variant="outline" size="sm">
                  {userRole === "PATIENT" ? "Manage Records" : "View Patient Records"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:gap-0">
          <div className="flex flex-col gap-2 sm:flex-row">
            {isUpcoming && appointment.status === "CONFIRMED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmingAction("reschedule")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
            )}
            
            {isUpcoming && appointment.status !== "CANCELLED" && appointment.status !== "DECLINED" && (
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={handleCancelAppointment}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            )}
          </div>
          
          {confirmingAction && (
            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md mt-2 sm:mt-0">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm">
                {confirmingAction === "cancel" 
                  ? "Are you sure you want to cancel this appointment?" 
                  : "Do you want to reschedule this appointment?"
                }
              </span>
              <Button size="sm" variant="ghost" onClick={() => setConfirmingAction(null)}>No</Button>
              <Button size="sm" variant="default" onClick={handleConfirmAction}>Yes</Button>
            </div>
          )}

          <Button 
            variant="default" 
            size="sm"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}