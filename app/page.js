"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from "./login/page";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  // Effect to redirect to dashboard when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to the dashboard
    }
  }, [status, router]); // Dependency array includes status and router

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <button
          className="border border-solid border-black rounded"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });
          }}
        >
          Sign Out
        </button>
      );
    } else {
      return (
        <Login/>
      );
    }
  };

  return (
    <main>
      {showSession()}
    </main>
  );
}
