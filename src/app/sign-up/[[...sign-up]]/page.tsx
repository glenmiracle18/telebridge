"use client";

import { useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setShowSignUp(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
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
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto py-12">
        {!showSignUp ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Choose Your Role</CardTitle>
              <CardDescription className="text-center">
                Select your role to continue with sign up
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <RadioGroup value={selectedRole || ""} onValueChange={handleRoleSelect} className="space-y-4">
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="flex-1 cursor-pointer">
                      <div className="font-medium">Patient</div>
                      <div className="text-sm text-muted-foreground">
                        I'm seeking medical consultations and care
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor" className="flex-1 cursor-pointer">
                      <div className="font-medium">Doctor</div>
                      <div className="text-sm text-muted-foreground">
                        I'm a healthcare provider offering consultations
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin" className="flex-1 cursor-pointer">
                      <div className="font-medium">Admin</div>
                      <div className="text-sm text-muted-foreground">
                        I manage the TeleBridge platform
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <Button 
                  className="w-full" 
                  onClick={handleContinue}
                  disabled={!selectedRole}
                >
                  Continue
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/sign-in" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SignUp 
            path="/sign-up" 
            routing="path" 
            signInUrl="/sign-in"
            afterSignUpUrl="/onboarding"
            unsafeMetadata={{ role: selectedRole }}
          />
        )}
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