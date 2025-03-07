"use client";

import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [user]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-400 to-pink-600 ... text-white" >
<div className="pt-16 w-full max-w-md mx-auto text-white">
        <h1>Welcome, {user?.email}!</h1>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
