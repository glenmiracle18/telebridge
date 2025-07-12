"use server"
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Interface for creating a new appointment
 */
interface CreateAppointmentParams {
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

/**
 * Interface for updating an appointment
 */
interface UpdateAppointmentParams {
  id: string;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  status?: AppointmentStatus;
}

/**
 * Creates a new appointment with REQUESTED status
 */
export async function createAppointment({
  patientId,
  doctorId,
  startTime,
  endTime,
  notes,
}: CreateAppointmentParams) {
  try {
    // Check for time conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { in: [AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED] },
        OR: [
          {
            // Starts during existing appointment
            startTime: { gte: startTime, lt: endTime }
          },
          {
            // Ends during existing appointment
            endTime: { gt: startTime, lte: endTime }
          },
          {
            // Contains existing appointment
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return { error: 'The selected time is not available.' };
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        startTime,
        endTime,
        status: AppointmentStatus.REQUESTED,
        notes,
      },
    });

    // Create a notification for the doctor
    await prisma.notification.create({
      data: {
        userId: await getDoctorUserId(doctorId),
        type: 'APPOINTMENT_REQUEST',
        message: `You have a new appointment request for ${formatDate(startTime)}`,
      },
    });

    revalidatePath('/dashboard/appointments');
    return { appointment };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { error: 'Failed to create appointment' };
  }
}

/**
 * Gets all appointments for a specific patient
 */
export async function getPatientAppointments(patientId: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          select: {
            fullName: true,
            specialty: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return { appointments };
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return { error: 'Failed to fetch appointments' };
  }
}

/**
 * Gets all appointments for a specific doctor
 */
export async function getDoctorAppointments(doctorId: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
      },
      include: {
        patient: {
          select: {
            fullName: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return { appointments };
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return { error: 'Failed to fetch appointments' };
  }
}

/**
 * Gets a specific appointment by ID
 */
export async function getAppointmentById(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!appointment) {
      return { error: 'Appointment not found' };
    }

    return { appointment };
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return { error: 'Failed to fetch appointment' };
  }
}

/**
 * Updates an appointment
 */
export async function updateAppointment({
  id,
  startTime,
  endTime,
  notes,
  status,
}: UpdateAppointmentParams) {
  try {
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });

    if (!currentAppointment) {
      return { error: 'Appointment not found' };
    }

    // If updating the time, check for conflicts
    if (startTime || endTime) {
      const newStartTime = startTime || currentAppointment.startTime;
      const newEndTime = endTime || currentAppointment.endTime;

      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          doctorId: currentAppointment.doctorId,
          id: { not: id }, // Exclude the current appointment
          status: { in: [AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED] },
          OR: [
            {
              startTime: { gte: newStartTime, lt: newEndTime }
            },
            {
              endTime: { gt: newStartTime, lte: newEndTime }
            },
            {
              AND: [
                { startTime: { lte: newStartTime } },
                { endTime: { gte: newEndTime } }
              ]
            }
          ]
        }
      });

      if (conflictingAppointment) {
        return { error: 'The selected time conflicts with another appointment.' };
      }
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(notes && { notes }),
        ...(status && { status }),
      },
    });

    // Create notifications for status changes
    if (status) {
      const patientUserId = await getPatientUserId(currentAppointment.patientId);
      const doctorName = currentAppointment.doctor.fullName;
      const appointmentDate = formatDate(currentAppointment.startTime);

      if (status === AppointmentStatus.CONFIRMED) {
        await prisma.notification.create({
          data: {
            userId: patientUserId,
            type: 'APPOINTMENT_CONFIRMED',
            message: `Your appointment with Dr. ${doctorName} for ${appointmentDate} has been confirmed.`,
          },
        });
      } else if (status === AppointmentStatus.DECLINED) {
        await prisma.notification.create({
          data: {
            userId: patientUserId,
            type: 'APPOINTMENT_DECLINED',
            message: `Your appointment with Dr. ${doctorName} for ${appointmentDate} has been declined.`,
          },
        });
      }
    }

    revalidatePath('/dashboard/appointments');
    return { appointment: updatedAppointment };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { error: 'Failed to update appointment' };
  }
}

/**
 * Cancels an appointment
 */
export async function cancelAppointment(id: string, cancelledBy: 'DOCTOR' | 'PATIENT') {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, patient: true },
    });

    if (!appointment) {
      return { error: 'Appointment not found' };
    }

    // Update the appointment status to CANCELLED
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
      },
    });

    // Create notifications
    const doctorUserId = await getDoctorUserId(appointment.doctorId);
    const patientUserId = await getPatientUserId(appointment.patientId);
    const appointmentDate = formatDate(appointment.startTime);

    if (cancelledBy === 'DOCTOR') {
      await prisma.notification.create({
        data: {
          userId: patientUserId,
          type: 'SYSTEM',
          message: `Your appointment with Dr. ${appointment.doctor.fullName} for ${appointmentDate} has been cancelled.`,
        },
      });
    } else {
      await prisma.notification.create({
        data: {
          userId: doctorUserId,
          type: 'SYSTEM',
          message: `The appointment with ${appointment.patient.fullName} for ${appointmentDate} has been cancelled by the patient.`,
        },
      });
    }

    revalidatePath('/dashboard/appointments');
    return { appointment: updatedAppointment };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { error: 'Failed to cancel appointment' };
  }
}

/**
 * Gets upcoming appointments for a patient
 */
export async function getUpcomingPatientAppointments(patientId: string) {
  try {
    const now = new Date();
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId,
        startTime: { gte: now },
        status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.REQUESTED] },
      },
      include: {
        doctor: {
          select: {
            fullName: true,
            specialty: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return { appointments };
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return { error: 'Failed to fetch upcoming appointments' };
  }
}

/**
 * Gets upcoming appointments for a doctor
 */
export async function getUpcomingDoctorAppointments(doctorId: string) {
  try {
    const now = new Date();
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: { gte: now },
        status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.REQUESTED] },
      },
      include: {
        patient: {
          select: {
            fullName: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return { appointments };
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return { error: 'Failed to fetch upcoming appointments' };
  }
}

/**
 * Gets today's appointments for a doctor
 */
export async function getTodayDoctorAppointments(doctorId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: { 
          gte: today,
          lt: tomorrow
        },
        status: AppointmentStatus.CONFIRMED,
      },
      include: {
        patient: {
          select: {
            fullName: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return { appointments };
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    return { error: 'Failed to fetch today\'s appointments' };
  }
}

/**
 * Helper function to format dates in a user-friendly way
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Helper function to get a doctor's user ID
 */
async function getDoctorUserId(doctorId: string): Promise<string> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { userId: true },
  });
  
  return doctor?.userId || '';
}

/**
 * Helper function to get a patient's user ID
 */
async function getPatientUserId(patientId: string): Promise<string> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { userId: true },
  });
  
  return patient?.userId || '';
}

/**
 * Check if a doctor is available at a specific time
 */
export async function checkDoctorAvailability(
  doctorId: string,
  startTime: Date,
  endTime: Date
) {
  try {
    // Check for existing appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { in: [AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED] },
        OR: [
          {
            startTime: { gte: startTime, lt: endTime }
          },
          {
            endTime: { gt: startTime, lte: endTime }
          },
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return { available: false };
    }
    
    // Check doctor's availability schedule
    const dayOfWeek = startTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startTimeString = `${startTime.getHours()}:${String(startTime.getMinutes()).padStart(2, '0')}`;
    const endTimeString = `${endTime.getHours()}:${String(endTime.getMinutes()).padStart(2, '0')}`;
    
    const availability = await prisma.availability.findFirst({
      where: {
        doctorId,
        dayOfWeek,
        startTime: { lte: startTimeString },
        endTime: { gte: endTimeString }
      }
    });

    return { available: !!availability };
  } catch (error) {
    console.error('Error checking doctor availability:', error);
    return { error: 'Failed to check availability' };
  }
}

/**
 * Get doctor's availability for a specific date
 */
export async function getDoctorAvailabilityForDate(doctorId: string, date: Date) {
  try {
    const dayOfWeek = date.getDay();
    
    // Get doctor's regular schedule for this day
    const availabilities = await prisma.availability.findMany({
      where: {
        doctorId,
        dayOfWeek,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Get existing appointments for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: [AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED] },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Process the available time slots
    const availableSlots = [];
    
    for (const availability of availabilities) {
      // Parse the time strings to create Date objects
      const [startHour, startMinute] = availability.startTime.split(':').map(Number);
      const [endHour, endMinute] = availability.endTime.split(':').map(Number);
      
      const startTime = new Date(date);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(endHour, endMinute, 0, 0);
      
      // Create 30-minute slots
      const slots = [];
      let currentSlotStart = new Date(startTime);
      
      while (currentSlotStart < endTime) {
        const currentSlotEnd = new Date(currentSlotStart);
        currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + 30);
        
        if (currentSlotEnd <= endTime) {
          // Check if this slot conflicts with any existing appointment
          const isConflicting = existingAppointments.some(appt => {
            return (
              (currentSlotStart >= appt.startTime && currentSlotStart < appt.endTime) ||
              (currentSlotEnd > appt.startTime && currentSlotEnd <= appt.endTime) ||
              (currentSlotStart <= appt.startTime && currentSlotEnd >= appt.endTime)
            );
          });
          
          if (!isConflicting) {
            slots.push({
              start: new Date(currentSlotStart),
              end: new Date(currentSlotEnd),
            });
          }
        }
        
        // Move to the next slot
        currentSlotStart.setMinutes(currentSlotStart.getMinutes() + 30);
      }
      
      availableSlots.push(...slots);
    }

    return { availableSlots };
  } catch (error) {
    console.error('Error getting doctor availability:', error);
    return { error: 'Failed to get availability' };
  }
}
