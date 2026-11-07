"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";
import LoginForm from "./LoginForm";
import Editor from "./Editor";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getAuth(getFirebaseApp()), setUser);
  }, []);

  if (!isFirebaseConfigured) {
    return <p className="p-8 text-center">Firebase isn&apos;t configured. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local.</p>;
  }

  if (user === undefined) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-8 animate-spin text-highlight" />
      </div>
    );
  }

  if (!user) return <LoginForm />;

  const logout = () => signOut(getAuth(getFirebaseApp()));

  if (ADMIN_EMAIL && user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="grid min-h-dvh place-items-center gap-4 p-8 text-center">
        <div>
          <p className="mb-4">This account isn&apos;t allowed to edit the site.</p>
          <button onClick={logout} className="cursor-pointer rounded-full bg-tgc px-6 py-2">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <Editor user={user} onSignOut={logout} />;
}