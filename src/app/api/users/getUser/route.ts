import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export type UserType = typeof users.$inferInsert;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email and username are required" },
        { status: 400 }
      );
    }

    const res = await db.select().from(users).where(eq(users.email, email));

    if (res.length === 0) {
      return NextResponse.json(
        { error: "No user found with the given email" },
        { status: 404 }
      );
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error getting user:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
