import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { followings, users } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { uniqueBy } from "@/lib/utils";

export type UserType = typeof users.$inferInsert;
export type UserPageResponse = {
  user: UserType | null;
  followings: UserType[] | null;
  followers: UserType[] | null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const followingRelation = alias(followings, "followingRelation");
    const followerRelation = alias(followings, "followerRelation");
    const following = alias(users, "following");
    const follower = alias(users, "follower");

    const data = await db
      .select()
      .from(users)
      .leftJoin(followingRelation, eq(users.id, followingRelation.followerId))
      .leftJoin(following, eq(following.id, followingRelation.followingId))
      .leftJoin(followerRelation, eq(users.id, followerRelation.followingId))
      .leftJoin(follower, eq(follower.id, followerRelation.followerId))
      .where(eq(users.username, username));

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No user found with the given email" },
        { status: 404 }
      );
    }

    const formattedData = {
      user: data[0]?.user,
      followings: data[0]?.follower
        ? uniqueBy(
            data.map((entry) => entry.following),
            (following) => following?.id ?? ""
          )
        : null,
      followers: data[0]?.follower
        ? uniqueBy(
            data.map((entry) => entry.follower),
            (follower) => follower?.id ?? ""
          )
        : null,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error getting user:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
