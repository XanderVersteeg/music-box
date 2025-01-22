"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/users?id=themovingcomic@gmail.com");
      const data = await response.json();
      setUser(data[0]);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
      <div className="p-40">{user ? JSON.stringify(user) : "Loading..."}</div>
    </>
  );
}
