"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { UserType } from "@/app/api/users/getUserPage/route";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";

export default function UserPage() {
  const params = useParams();
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
      <MaxWidthWrapper>
        <div>Loading...</div>
      </MaxWidthWrapper>
    );

  if (!data || !data[0])
    return (
      <MaxWidthWrapper>
        <div>This user does not exist</div>
      </MaxWidthWrapper>
    );

  return (
    <MaxWidthWrapper>
      <div>{data[0].username}</div>
    </MaxWidthWrapper>
  );
}
