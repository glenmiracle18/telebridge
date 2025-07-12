'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalRecord, RecordType } from '@prisma/client';
import { format } from 'date-fns';
import { FileText, Download, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { deleteMedicalRecord } from '@/lib/actions/medical-record-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Helper function to get the icon for each record type
function getRecordTypeIcon(type: RecordType) {
  switch (type) {
    case 'CONSULTATION':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'PRESCRIPTION':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'LAB_RESULT':
      return <FileText className="h-5 w-5 text-amber-500" />;
    case 'IMAGING':
      return <FileText className="h-5 w-5 text-purple-500" />;
    case 'DOCUMENT':
      return <FileText className="h-5 w-5 text-gray-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
}

// Helper function to format record type for display
function formatRecordType(type: RecordType) {
  return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

export default function MedicalRecordsList({ records }: { records: MedicalRecord[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (recordId: string) => {
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      setIsDeleting(recordId);
      try {
        const result = await deleteMedicalRecord(recordId);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Record deleted successfully');
        }
      } catch (error) {
        toast.error('Failed to delete record');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record) => (
        <Card key={record.id}>
          <CardHeader className="flex flex-row items-center gap-2">
            {getRecordTypeIcon(record.recordType)}
            <div>
              <CardTitle className="text-lg">{record.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {formatRecordType(record.recordType)} • {format(new Date(record.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {record.description || 'No description provided'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/medical-records/${record.id}`}>
                  View
                </Link>
              </Button>
              {record.fileUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={record.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </a>
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/medical-records/${record.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDelete(record.id)}
                disabled={isDeleting === record.id}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 