import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { username, email } = await request.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: "Email and username are required" },
        { status: 400 }
      );
    }

    const res = await db
      .update(users)
      .set({ username: username })
      .where(eq(users.email, email));

    if (res.rowCount === 0) {
      return NextResponse.json(
        { error: "No user found with the given email" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error updating username:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
