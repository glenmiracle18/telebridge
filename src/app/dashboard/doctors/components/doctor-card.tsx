'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Doctor, User } from '@prisma/client';
import { StarIcon } from 'lucide-react';
import Link from 'next/link';

type DoctorWithUser = Doctor & {
  user: Pick<User, 'email' | 'phoneNumber'>;
};

export default function DoctorCard({ doctor }: { doctor: DoctorWithUser }) {
  const initials = doctor.fullName
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-20"></div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="flex justify-center -mt-10 mb-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={doctor.profilePhoto || undefined} alt={doctor.fullName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-semibold text-xl">{doctor.fullName}</h3>
          <p className="text-muted-foreground">{doctor.specialty.replace('_', ' ')}</p>
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{doctor.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <span className="mx-2">•</span>
          <span>{doctor.yearsOfExperience} years exp.</span>
          <span className="mx-2">•</span>
          <Badge variant="outline">${doctor.consultationFee?.toString() || 'N/A'}</Badge>
        </div>

        <div className="space-y-2 mt-4">
          <div className="flex items-center">
            <span className="text-sm font-medium w-24">Hospital:</span>
            <span className="text-sm text-muted-foreground">{doctor.hospital}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium w-24">Languages:</span>
            <span className="text-sm text-muted-foreground">{doctor.languagesSpoken}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/doctors/${doctor.id}`}>View Profile</Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/doctors/${doctor.id}/book`}>Book Appointment</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 