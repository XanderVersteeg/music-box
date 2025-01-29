"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { UserPageResponse, UserType } from "@/app/api/users/getUserPage/route";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";

export default function UserPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const { data: usesession } = useSession();

  // Session useQuery
  const { data: session } = useQuery({
    queryKey: ["getUser", usesession?.user?.email],
    queryFn: async (): Promise<Array<UserType>> => {
      const response = await fetch(
        `/api/users/getUser?email=${usesession?.user?.email}`
      );

      return response.json();
    },
  });

  // Data useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["getUserPage", params.username, params.sessionId],
    queryFn: async (): Promise<UserPageResponse> => {
      const response = await fetch(
        `/api/users/getUserPage?username=${params.username}&sessionId=${session?.[0]?.id}`
      );
      return response.json();
    },
  });

  const { user, followers } = data || {};

  // FollowUser useMutation
  const { mutateAsync: insertFollowing, isPending: insertFollowingIsPending } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch("/api/users/followUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followerId: session?.[0]?.id,
            followingId: user?.id,
          }),
        });

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getUserPage"] });
      },
    });

  // UnfollowUser useMutation
  const { mutateAsync: deletetFollowing, isPending: deleteFollowingIsPending } =
    useMutation({
      mutationFn: async () => {
        const response = await fetch("/api/users/unfollowUser", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followerId: session?.[0]?.id,
            followingId: user?.id,
          }),
        });

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getUserPage"] });
      },
    });

  if (isLoading) {
    return (
      <MaxWidthWrapper className="flex flex-col items-center pt-32">
        <div>Loading...</div>
      </MaxWidthWrapper>
    );
  }

  if (!user)
    return (
      <MaxWidthWrapper className="flex flex-col items-center pt-32">
        <div>This user does not exist</div>
      </MaxWidthWrapper>
    );

  return (
    <>
      <MaxWidthWrapper className="flex flex-col items-center pt-32">
        <div className="flex flex-row space-x-4 w-full justify-between px-4">
          <div className="flex flex-row space-x-4">
            <div>
              {user.image && (
                <Image
                  src={user.image}
                  alt="user image"
                  className="rounded-2xl"
                  height={96}
                  width={96}
                />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-4xl font-bold">{user.username}</div>
              <div className="text-sm font-normal text-slate-500">
                {user.name}
              </div>
            </div>
          </div>
          {session && session[0] && !isLoading && (
            <div className="flex flex-col justify-center">
              {session[0].id === user.id ? (
                <Button variant="secondary">
                  <Link href="/settings">Settings</Link>
                </Button>
              ) : (
                <>
                  {session && session[0] && (
                    <div className="flex flex-col justify-center">
                      {session[0].id === user.id ? (
                        <Button variant="secondary">
                          <Link href="/settings">Settings</Link>
                        </Button>
                      ) : (
                        <>
                          {followers?.some(
                            (item) => item?.id === session[0].id
                          ) ? (
                            <Button
                              variant="secondary"
                              disabled={deleteFollowingIsPending}
                              onClick={() => {
                                deletetFollowing();
                              }}
                            >
                              Unfollow
                            </Button>
                          ) : (
                            <Button
                              disabled={insertFollowingIsPending}
                              onClick={() => {
                                insertFollowing();
                              }}
                            >
                              Follow
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
