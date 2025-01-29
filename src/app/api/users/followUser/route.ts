import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { followings } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { followerId, followingId } = await request.json();

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
      .values({ followerId: followerId, followingId: followingId });

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
}
