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

// export async function POST(
//   request: Request
// ): Promise<NextResponse<{ success: boolean } | { error: string }>> {
//   try {
//     const body = await request.json();

//     if (!body.email || !body.username) {
//       return NextResponse.json(
//         { error: "Email and username are required" },
//         { status: 400 }
//       );
//     }

//     const updated = await db
//       .update(users)
//       .set({ username: body.username })
//       .where(eq(users.email, body.email));

//     if (updated.rowCount === 0) {
//       return NextResponse.json(
//         { error: "No user found with the given email" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true });
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     return NextResponse.json(
//       { error: "An error occurred while updating the user" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(
  request: Request
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  const body = await request.json();

  if (!body.email || !body.username) {
    return NextResponse.json(
      { error: "Email and username are required" },
      { status: 400 }
    );
  }

  const updated = await db
    .update(users)
    .set({ username: body.username })
    .where(eq(users.email, body.email));

  if (updated.rowCount === 0) {
    return NextResponse.json(
      { error: "No user found with the given email" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
