"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import MedicalRecordsList from './components/medical-records-list';
import { prisma } from '@/lib/prisma';
import { useUser } from '@clerk/nextjs';
import { getMedicalRecords } from '@/lib/actions/medical-record-actions';

export default async function MedicalRecordsPage() {
  const { user: clerkUser } = useUser();
  
  if (!clerkUser) {
    redirect('/sign-in');
  }

  // Get the patient ID from the user
  const userRecord = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { patient: true },
  });

  if (!userRecord?.patient) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              You need to complete your patient profile to access medical records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { records, error } = await getMedicalRecords(userRecord.patient.id);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your medical history
          </p>
        </div>
        
        <Button asChild>
          <Link href="/dashboard/medical-records/new">
            Add New Record
          </Link>
        </Button>
      </div>

      {error ? (
        <Card className="p-6">
          <p className="text-center text-red-500">{error}</p>
        </Card>
      ) : records && records.length > 0 ? (
        <MedicalRecordsList records={records} />
      ) : (
        <Card className="p-6">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">You don't have any medical records yet</p>
            <Button asChild>
              <Link href="/dashboard/medical-records/new">
                Add Your First Record
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 