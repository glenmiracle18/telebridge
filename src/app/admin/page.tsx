"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

interface AdminData {
  message: string;
  adminData: {
    users: string;
    settings: string;
  };
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const response = await fetch("/api/admin");
        
        if (response.ok) {
          const data = await response.json();
          setAdminData(data);
          setError(null);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "You don't have permission to access this page");
          setAdminData(null);
        }
      } catch (err) {
        setError("Failed to verify admin access");
        setAdminData(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoaded && user) {
      checkAdminAccess();
    } else if (isLoaded && !user) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  // Redirect if not signed in
  if (isLoaded && !user) {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <SignedIn>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading admin access...</p>
          </div>
        ) : error ? (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                If you believe you should have access, please contact the system administrator.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Manage all users in the system</p>
                <Button>View Users</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure system settings</p>
                <Button>Manage Settings</Button>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">View system activity logs</p>
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to access the admin dashboard</p>
        </div>
      </SignedOut>
    </div>
  );
} 