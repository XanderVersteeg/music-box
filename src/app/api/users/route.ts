import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export type UserType = typeof users.$inferInsert;

export async function GET(
  request: Request
): Promise<NextResponse<UserType[] | { error: string }>> {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("id");

  if (!userEmail) {
    return NextResponse.json(
      { error: "User email is required" },
      { status: 400 }
    );
  }

  const user = await db.select().from(users).where(eq(users.email, userEmail));

  return NextResponse.json(user);
}
