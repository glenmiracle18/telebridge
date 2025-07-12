'use server';

import { prisma } from '@/lib/prisma';

/**
 * Fetch patient by Clerk user ID
 */
export async function getPatientByClerkId(clerkId: string) {
  try {
    // First find the user by clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    // Then find the patient linked to this user
    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    });

    if (!patient) {
      return { error: 'Patient profile not found' };
    }

    return { patient };
  } catch (error) {
    console.error('Error fetching patient by clerk ID:', error);
    return { error: 'Failed to fetch patient information' };
  }
}

/**
 * For demo purposes - get the seeded patient profile
 * In a real app, this would be replaced with proper user authentication
 */
export async function getFirstPatient() {
  try {
    const patient = await prisma.patient.findFirst();
    
    if (!patient) {
      return { error: 'No patients found in the database' };
    }
    
    return { patient };
  } catch (error) {
    console.error('Error fetching demo patient:', error);
    return { error: 'Failed to fetch patient information' };
  }
}