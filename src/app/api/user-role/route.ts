import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;

  return NextResponse.json({
    userId,
    email: user?.emailAddresses[0]?.emailAddress,
    role: role || "patient", // Default role
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { role } = await request.json();
    
    if (!role || !["patient", "doctor", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // For updating user metadata, we need to use the Clerk API directly
    // This requires a separate API call in a production environment
    // For this example, we'll just return success
    
    return NextResponse.json({ 
      success: true, 
      role,
      message: "To update user role in production, you would make an API call to Clerk" 
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
} 