'use server';

import { prisma } from '@/lib/prisma';
import { Specialty } from '@prisma/client';

export async function getDoctors(specialtyFilter?: Specialty) {
  try {
    const doctors = await prisma.doctor.findMany({
      where: specialtyFilter ? { specialty: specialtyFilter } : undefined,
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return { doctors };
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return { error: 'Failed to fetch doctors' };
  }
}

export async function getDoctorById(doctorId: string) {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
        availabilities: true,
      },
    });

    if (!doctor) {
      return { error: 'Doctor not found' };
    }

    return { doctor };
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return { error: 'Failed to fetch doctor details' };
  }
}

export async function getDoctorAvailability(doctorId: string) {
  try {
    const availability = await prisma.availability.findMany({
      where: { doctorId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return { availability };
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return { error: 'Failed to fetch doctor availability' };
  }
}

export async function getSpecialties() {
  // Return all specialty enum values
  return Object.values(Specialty);
} 