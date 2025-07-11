import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Simplified middleware without auth
  // In a real application, you would check for authentication here
  
  // For demo purposes, we'll just allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/doctor-profile", "/patient-profile"],
};