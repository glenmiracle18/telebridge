"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Icons
import { 
  Search, Star, MessageSquare, Calendar, ArrowRight,
  ChevronRight, Home, Filter, Clock, MapPin, Stethoscope
} from "lucide-react";

// Doctor actions
import { getDoctors, getSpecialties } from "@/lib/actions/doctor-actions";
import { Specialty } from "@prisma/client";

function DoctorsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialtyParam = searchParams.get('specialty');
  
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    specialtyParam || null
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Get all specialties
        const specialtyValues = await getSpecialties();
        setSpecialties(specialtyValues);
        
        // Get doctors, filtered by specialty if selected
        const { doctors, error } = await getDoctors(
          selectedSpecialty as Specialty
        );
        
        if (error) {
          console.error(error);
          setDoctors([]);
        } else {
          setDoctors(doctors || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [selectedSpecialty]);

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format specialty for display
  const formatSpecialty = (specialty: string) => {
    return specialty
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleSpecialtyChange = (value: string) => {
    if (value === "ALL") {
      setSelectedSpecialty(null);
      router.push('/dashboard/doctors');
    } else {
      setSelectedSpecialty(value);
      router.push(`/dashboard/doctors?specialty=${value}`);
    }
  };

  return (
    <div className="px-8 py-8">
      {/* Page heading with breadcrumb */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <Link href="/dashboard" className="flex items-center hover:text-foreground">
            <Home className="h-4 w-4 mr-1" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Doctors</span>
        </div>
        <h1 className="text-3xl font-bold">Find a Specialist</h1>
        <p className="text-muted-foreground mt-2">
          Browse our network of qualified healthcare specialists for your virtual consultation
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search by name, specialty, or hospital..."
            className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0">
          <Button variant="outline" className="h-10 gap-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
        </div>
      </div>

      {/* Specialty tabs */}
      <Tabs 
        defaultValue={selectedSpecialty || "ALL"} 
        onValueChange={handleSpecialtyChange}
        className="mb-8"
      >
        <TabsList className="w-full overflow-auto flex flex-nowrap justify-start p-1 mb-2">
          <TabsTrigger value="ALL" className="flex-shrink-0">
            All Specialties
          </TabsTrigger>
          {specialties.map((specialty) => (
            <TabsTrigger 
              key={specialty} 
              value={specialty}
              className="flex-shrink-0"
            >
              {formatSpecialty(specialty)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            "Loading doctors..."
          ) : (
            `Found ${filteredDoctors.length} doctor${filteredDoctors.length === 1 ? '' : 's'}`
          )}
        </p>
      </div>

      {/* Doctors grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 bg-muted rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded mb-2"></div>
            <div className="h-3 w-32 bg-muted rounded"></div>
          </div>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <Stethoscope className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No doctors found</h3>
          <p className="text-muted-foreground mb-8">
            {selectedSpecialty 
              ? `No ${formatSpecialty(selectedSpecialty)} specialists available at the moment` 
              : "No doctors match your search criteria"}
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setSelectedSpecialty(null);
          }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden border shadow-sm hover:shadow transition-all duration-200">
              <div className="p-6">
                {/* Doctor header with avatar and name */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage 
                      src={doctor.profilePhoto || ""} 
                      alt={doctor.fullName}
                    />
                    <AvatarFallback className="text-lg font-medium">
                      {doctor.fullName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg leading-tight mb-1">{doctor.fullName}</h3>
                    <Badge variant="secondary" className="font-normal">
                      {formatSpecialty(doctor.specialty)}
                    </Badge>
                  </div>
                </div>
                
                {/* Hospital location */}
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{doctor.hospital}</span>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= Math.round(doctor.rating) 
                          ? "text-yellow-500 fill-yellow-500" 
                          : "text-gray-300 fill-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{doctor.rating.toFixed(1)}</span>
                </div>

                {/* Doctor details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Experience</p>
                    <p className="font-medium">{doctor.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Consultation Fee</p>
                    <p className="font-medium">${doctor.consultationFee}</p>
                  </div>
                </div>
                
                {/* Bio with line clamp */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                  {doctor.bio || "No bio available."}
                </p>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <Button 
                    onClick={() => router.push(`/dashboard/doctors/${doctor.id}`)}
                    className="w-full"
                    size="sm"
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="sm"
                    onClick={() => router.push(`/dashboard/doctors/${doctor.id}/book`)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Loading component for Suspense fallback
function DoctorsLoading() {
  return (
    <div className="px-8 py-8">
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center text-sm text-muted-foreground mb-1">
          <div className="h-4 w-4 bg-muted rounded mr-1 animate-pulse"></div>
          <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded mb-2"></div>
          <div className="h-3 w-32 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function DoctorsList() {
  return (
    <Suspense fallback={<DoctorsLoading />}>
      <DoctorsListContent />
    </Suspense>
  );
}
