"use client";

import { useState } from "react";
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, Lock } from "lucide-react";
import { getFirebaseApp } from "@/lib/firebase";

const inputCls =
  "w-full rounded-lg border border-border/60 bg-tgc/60 px-3 py-2.5 text-text placeholder:text-text-turnery focus:border-highlight focus:outline-none";

function friendly(code: string) {
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Incorrect email or password.";
  if (code.includes("too-many-requests")) return "Too many attempts. Try again in a few minutes.";
  if (code.includes("unauthorized-domain")) return "This domain isn't authorized in Firebase Authentication settings.";
  return "Sign-in failed. Please try again.";
}

export default function LoginForm() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "info"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await signInWithEmailAndPassword(getAuth(getFirebaseApp()), email, password);
    } catch (err) {
      setMsg({ type: "error", text: friendly(String((err as { code?: string }).code ?? err)) });
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!email) return setMsg({ type: "error", text: "Enter your email first." });
    try {
      await sendPasswordResetEmail(getAuth(getFirebaseApp()), email);
      setMsg({ type: "info", text: "Password reset link sent to your email." });
    } catch {
      setMsg({ type: "error", text: "Couldn't send the reset email." });
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-fgc/60 p-6 shadow-xl backdrop-blur-lg md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-tgc">
            <Lock className="size-5" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <p className="text-sm text-text-turnery">Sign in to edit your portfolio</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className={inputCls} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-tgc px-6 py-3 font-medium hover:bg-tgc/80 disabled:opacity-60"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            Sign In
          </button>
          <button type="button" onClick={onReset} className="cursor-pointer text-sm text-text-turnery hover:text-text">
            Forgot password? Send a reset link
          </button>
          {msg && <p className={`text-sm ${msg.type === "error" ? "text-red-300" : "text-highlight"}`}>{msg.text}</p>}
        </div>
      </form>
    </div>
  );
}