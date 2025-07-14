'use server';

import { prisma } from '@/lib/prisma';

// get medical records for a specific patient
export async function getMedicalRecords(patientId: string) {
  try {
    const records = await prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return { records };
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return { error: 'Failed to fetch medical records' };
  }
}


// delete a medical record by ID
export async function deleteMedicalRecord(recordId: string) {
  try {
    const record = await prisma.medicalRecord.delete({
      where: { id: recordId },
    });

    return { success: true, record };
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return { error: 'Failed to delete medical record' };
  }
}