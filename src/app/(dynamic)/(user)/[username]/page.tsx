/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { UserType } from "@/app/api/users/getUserPage/route";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";

export default function UserPage() {
  const params = useParams();
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["getUserPage", params.username],
    queryFn: async (): Promise<Array<UserType>> => {
      const response = await fetch(
        `/api/users/getUserPage?username=${params.username}`
      );

      return response.json();
    },
  });

  if (isLoading)
    return (
      <MaxWidthWrapper className="flex flex-col items-center pt-32">
        <div>Loading...</div>
      </MaxWidthWrapper>
    );

  if (!data || !data[0])
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
              {data[0].image ? (
                <img
                  src={data[0].image}
                  alt="user image"
                  className="rounded-2xl"
                  height={96}
                  width={96}
                />
              ) : (
                <>no image</>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-4xl font-bold">{data[0].username}</div>
              <div className="text-sm font-normal text-slate-500">
                {data[0].name}
              </div>
            </div>
          </div>
          {session?.user && (
            <div className="flex flex-col justify-center">
              {session?.user?.email === data[0].email ? (
                <Button className="hover:cursor-pointer" variant="secondary">
                  <Link href="/settings">Settings</Link>
                </Button>
              ) : (
                <Button>Follow</Button>
              )}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
