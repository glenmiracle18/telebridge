"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  
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
            <SignedIn>
              <span className="text-sm">{user?.primaryEmailAddress?.emailAddress}</span>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <SignedIn>
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Welcome to TeleBridge, {user?.firstName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This is your personalized dashboard.
                </p>
                <div className="mt-4">
                  <Button>
                    Complete Your Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cards for all users */}
            <Card>
              <CardHeader>
                <CardTitle>Find Specialists</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>Browse Doctors</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No upcoming appointments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Button>View Records</Button>
              </CardContent>
            </Card>
          </div>
        </SignedIn>
        
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-3xl font-bold mb-4">Access Required</h1>
            <p className="text-muted-foreground mb-8">Please sign in to access your dashboard</p>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <Button variant="default" size="lg">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" size="lg">
                  Create an account
                </Button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
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