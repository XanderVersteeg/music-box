// File: /app/api/users/route.js
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const user = await db.select().from(users);
  return NextResponse.json(user);
}
