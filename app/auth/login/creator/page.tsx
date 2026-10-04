"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function CreatorLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  function friendlyError(err: any) {
    const code = err?.code || "";

    if (code === "auth/invalid-credential") {
      return "Incorrect email or password.";
    }

    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    if (code === "auth/popup-closed-by-user") {
      return "Google sign-in window was closed.";
    }

    if (code === "auth/popup-blocked") {
      return "Your browser blocked the Google sign-in popup.";
    }

    if (code === "auth/unauthorized-domain") {
      return "This website domain is not authorized in Firebase Authentication.";
    }

    if (code === "auth/operation-not-allowed") {
      return "Google sign-in is not enabled in Firebase yet.";
    }

    return (
      err?.message?.replace("Firebase: ", "") ||
      "Could not sign in."
    );
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const creatorSnap = await getDoc(
        doc(db, "creators", credential.user.uid)
      );

      if (!creatorSnap.exists()) {
        await signOut(auth);

        setError(
          "This account is not registered as a creator."
        );

        return;
      }

      router.push("/creator");
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function loginWithGoogle() {
    setGoogleBusy(true);
    setError("");
    setMessage("");

    try {
      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const user = result.user;

      const profileRef =
        doc(db, "profiles", user.uid);

      const profileSnap =
        await getDoc(profileRef);

      if (
        profileSnap.exists() &&
        profileSnap.data()?.role &&
        profileSnap.data()?.role !== "creator"
      ) {
        await signOut(auth);

        setError(
          "This Google account is already registered as a business account."
        );

        return;
      }

      await setDoc(
        profileRef,
        {
          id: user.uid,
          full_name:
            user.displayName || "",
          email:
            user.email || "",
          role: "creator",
          updated_at:
            new Date().toISOString(),
        },
        { merge: true }
      );

      const creatorRef =
        doc(db, "creators", user.uid);

      const creatorSnap =
        await getDoc(creatorRef);

      if (!creatorSnap.exists()) {
        const code =
          `CR-${user.uid
            .slice(0, 8)
            .toUpperCase()}`;

        await setDoc(
          creatorRef,
          {
            user_id: user.uid,
            display_name:
              user.displayName || "",
            email:
              user.email || "",
            referral_code: code,
            status: "active",
            affiliate_status:
              "signup_pending",
            created_at:
              new Date().toISOString(),
            updated_at:
              new Date().toISOString(),
          },
          { merge: true }
        );
      }

      router.push("/creator");
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setGoogleBusy(false);
    }
  }

  async function forgotPassword() {
    setError("");
    setMessage("");

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setError(
        "Enter your email address first."
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
    <main className="center">
      <div className="authBox">
        <span className="eyebrow">
          Creator Login
        </span>

        <h1>
          Welcome back.
        </h1>

        <p className="muted">
          Sign in to your ClientEasily
          creator account.
        </p>

        <button
          type="button"
          className="btn"
          onClick={loginWithGoogle}
          disabled={
            googleBusy || busy
          }
          style={{
            width: "100%",
            marginTop: 18,
          }}
        >
          {googleBusy
            ? "Signing in…"
            : "Continue with Google"}
        </button>

        <div
          style={{
            textAlign: "center",
            margin: "18px 0",
            opacity: 0.65,
          }}
        >
          or
        </div>

        <form
          className="form"
          onSubmit={login}
        >
          <label className="label">
            Email

            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </label>

          <label className="label">
            Password

            <input
              className="input"
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </label>

          <button
            type="button"
            onClick={forgotPassword}
            disabled={resetBusy}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              padding: 0,
              fontWeight: 700,
            }}
          >
            {resetBusy
              ? "Sending…"
              : "Forgot password?"}
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {message && (
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                background:
                  "rgba(34,197,94,.1)",
                marginTop: 10,
              }}
            >
              {message}
            </div>
          )}

          <button
            className="btn primary"
            disabled={
              busy || googleBusy
            }
          >
            {busy
              ? "Signing in…"
              : "Creator Login"}
          </button>
        </form>

        <p
          className="muted"
          style={{
            marginTop: 20,
          }}
        >
          New creator?{" "}
          <Link href="/auth/signup/creator">
            Create creator account
          </Link>
        </p>
      </div>
    </main>
  );
}