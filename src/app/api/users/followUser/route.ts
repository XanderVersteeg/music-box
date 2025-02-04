import { NextResponse, NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { followings } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const Session = await auth();
  const { followerId, followingId } = await req.json();

  if (Session) {
    try {
      if (Session?.user?.id !== followerId) {
        return NextResponse.json(
          { error: "User is not authenticated" },
          { status: 401 }
        );
      }

      if (!followerId || !followingId) {
        return NextResponse.json(
          { error: "followerId and followingId are required" },
          { status: 400 }
        );
      }

      if (followerId === followingId) {
        return NextResponse.json(
          { error: "User cannot follow themselves" },
          { status: 400 }
        );
      }

      const check = await db
        .select()
        .from(followings)
        .where(
          and(
            eq(followings.followerId, followerId),
            eq(followings.followingId, followingId)
          )
        );

      if (check.length > 0) {
        return NextResponse.json(
          { error: "User is already following this user" },
          { status: 400 }
        );
      }

      const res = await db
        .insert(followings)
        .values({ followerId, followingId });

      if (res.rowCount === 0) {
        return NextResponse.json(
          { error: "An unexpected error occurred" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.log("Error following user:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
