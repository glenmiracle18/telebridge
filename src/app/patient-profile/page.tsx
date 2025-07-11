"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function PatientProfile() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/telebridge-logo.svg"
              alt="TeleBridge Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
              }}
            />
            <span className="font-bold text-xl">TeleBridge</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">patient@example.com</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Patient Profile</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              router.push("/dashboard");
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="text-sm font-medium">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location (District/City)
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="diagnosis" className="text-sm font-medium">
                    Diagnosis (if applicable)
                  </label>
                  <input
                    id="diagnosis"
                    name="diagnosis"
                    type="text"
                    placeholder="e.g., Type 1 Diabetes, Hypertension"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Health Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="CHRONIC">Chronic Condition</option>
                    <option value="MENTAL_HEALTH">Mental Health</option>
                    <option value="MATERNAL_HEALTH">Maternal Health</option>
                    <option value="PEDIATRIC">Pediatric</option>
                    <option value="GERIATRIC">Geriatric</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="GENERAL">General</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="emergencyContact" className="text-sm font-medium">
                    Emergency Contact
                  </label>
                  <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="text"
                    placeholder="Name: Phone Number"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="medicalHistory" className="text-sm font-medium">
                    Brief Medical History
                  </label>
                  <textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Profile</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t py-6">
        <div className="container flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TeleBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 