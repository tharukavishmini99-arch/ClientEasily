"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      className="btn secondary"
      onClick={async () => {
        await signOut(auth);
        router.push("/");
      }}
    >
      Sign out
    </button>
  );
}
