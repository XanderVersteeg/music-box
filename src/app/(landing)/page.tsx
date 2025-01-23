"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const callApi = async (username: string) => {
    try {
      const response = await fetch("/api/updateUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: session?.user?.email,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <>
      <div className="p-40">
        <button
          className="hover:underline hover:cursor-pointer"
          onClick={() => callApi("test")}
        >
          Test api
        </button>
      </div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
      <div className="p-40">Home</div>
    </>
  );
}
