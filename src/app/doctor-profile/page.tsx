"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function DoctorProfile() {
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
            <span className="text-sm">doctor@example.com</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Doctor Profile</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              router.push("/dashboard");
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="specialty" className="text-sm font-medium">
                    Specialty
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select a specialty</option>
                    <option value="GYNECOLOGIST">Gynecologist</option>
                    <option value="NEUROLOGIST">Neurologist</option>
                    <option value="ONCOLOGIST">Oncologist</option>
                    <option value="PSYCHIATRIST">Psychiatrist</option>
                    <option value="CARDIOLOGIST">Cardiologist</option>
                    <option value="DERMATOLOGIST">Dermatologist</option>
                    <option value="PEDIATRICIAN">Pediatrician</option>
                    <option value="ORTHOPEDIST">Orthopedist</option>
                    <option value="GENERAL_PRACTITIONER">General Practitioner</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="hospital" className="text-sm font-medium">
                    Hospital/Institution
                  </label>
                  <input
                    id="hospital"
                    name="hospital"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="languages" className="text-sm font-medium">
                    Languages Spoken (comma separated)
                  </label>
                  <input
                    id="languages"
                    name="languages"
                    type="text"
                    placeholder="English, French, Kinyarwanda"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    required
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