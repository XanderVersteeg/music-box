import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export type User = typeof users.$inferInsert;

export async function GET(
  request: Request
): Promise<NextResponse<User[] | { error: string }>> {
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
