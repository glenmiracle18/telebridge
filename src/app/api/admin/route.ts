import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const role = user?.unsafeMetadata?.role as string | undefined;

  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  // Admin-only data or operations
  return NextResponse.json({
    message: "Admin access granted",
    adminData: {
      users: "Access to user management",
      settings: "Access to system settings",
    }
  });
} 