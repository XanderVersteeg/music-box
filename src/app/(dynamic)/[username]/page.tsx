"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { UserType } from "@/app/api/users/getUserPage/route";

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

  if (isLoading) return <div>Loading...</div>;

  if (!data || !data[0]) return <div>This user does not exist</div>;

  return <div>{data[0].username}</div>;
}
