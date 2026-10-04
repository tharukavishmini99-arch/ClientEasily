"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AuthForm({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [socialBusy, setSocialBusy] = useState(false);

  function saveReferralAndPlan() {
    const plan = params.get("plan");
    const ref = params.get("ref");

    if (plan) {
      localStorage.setItem("flowsell_plan", plan);
    }

    if (ref) {
      localStorage.setItem("flowsell_ref", ref);
    }
  }

  async function createBusinessProfile(user: any) {
    await setDoc(
      doc(db, "profiles", user.uid),
      {
        id: user.uid,
        full_name: user.displayName || "",
        email: user.email || "",
        role: "business",
        updated_at: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  function friendlyError(err: any) {
    const code = err?.code || "";

    if (code === "auth/popup-closed-by-user") {
      return "Sign-in window was closed.";
    }

    if (code === "auth/popup-blocked") {
      return "Your browser blocked the sign-in popup. Allow popups and try again.";
    }

    if (code === "auth/account-exists-with-different-credential") {
      return "An account already exists with this email using another sign-in method.";
    }

    if (code === "auth/unauthorized-domain") {
      return "This website domain is not authorized in Firebase Authentication.";
    }

    if (code === "auth/operation-not-allowed") {
      return "This sign-in method is not enabled in Firebase yet.";
    }

    if (code === "auth/invalid-credential") {
      return "Incorrect email or password.";
    }

    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    if (code === "auth/weak-password") {
      return "Password must be at least 8 characters.";
    }

    return (
      err?.message?.replace("Firebase: ", "") ||
      "Authentication failed."
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        if (name.trim()) {
          await updateProfile(credential.user, {
            displayName: name.trim(),
          });
        }

        await setDoc(
          doc(db, "profiles", credential.user.uid),
          {
            id: credential.user.uid,
            full_name: name.trim(),
            email: credential.user.email || "",
            role: "business",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );

        saveReferralAndPlan();

        router.push("/dashboard?onboarding=1");
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function loginWithGoogle() {
    setSocialBusy(true);
    setError("");
    setMessage("");

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(
        auth,
        provider
      );

      await createBusinessProfile(result.user);

      saveReferralAndPlan();

      router.push("/dashboard");
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setSocialBusy(false);
    }
  }

  async function forgotPassword() {
    setError("");
    setMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError(
        "Enter your email address first, then click Forgot password."
      );
      return;
    }

    setResetBusy(true);

    try {
      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      setMessage(
        "Password reset email sent. Check your inbox and spam folder."
      );
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setResetBusy(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <button
          type="button"
          className="btn secondary"
          onClick={loginWithGoogle}
          disabled={socialBusy || busy}
          style={{
            width: "100%",
            justifyContent: "center",
          }}
        >
          {socialBusy
            ? "Connecting..."
            : "Continue with Google"}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "18px 0",
        }}
      >
        <div
          style={{
            height: 1,
            background: "#e6e7eb",
            flex: 1,
          }}
        />

        <span
          className="muted"
          style={{
            fontSize: 13,
          }}
        >
          OR
        </span>

        <div
          style={{
            height: 1,
            background: "#e6e7eb",
            flex: 1,
          }}
        />
      </div>

      <form
        className="form"
        onSubmit={submit}
      >
        {mode === "signup" && (
          <label className="label">
            Full name

            <input
              className="input"
              required
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              autoComplete="name"
            />
          </label>
        )}

        <label className="label">
          Email

          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="label">
          Password

          <input
            className="input"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="At least 8 characters"
            autoComplete={
              mode === "login"
                ? "current-password"
                : "new-password"
            }
          />
        </label>

        {mode === "login" && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={forgotPassword}
              disabled={resetBusy}
              style={{
                border: 0,
                background: "transparent",
                color: "#5146e5",
                cursor: resetBusy
                  ? "not-allowed"
                  : "pointer",
                padding: 0,
                fontWeight: 700,
              }}
            >
              {resetBusy
                ? "Sending..."
                : "Forgot password?"}
            </button>
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {message && (
          <div className="notice">
            {message}
          </div>
        )}

        <button
          className="btn primary"
          disabled={busy || socialBusy}
        >
          {busy
            ? "Please wait…"
            : mode === "signup"
            ? "Create account"
            : "Log in"}
        </button>
      </form>
    </div>
  );
}