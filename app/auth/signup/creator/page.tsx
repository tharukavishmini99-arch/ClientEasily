"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function CreatorSignup() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [googleBusy, setGoogleBusy] =
    useState(false);

  const affiliateUrl =
    process.env
      .NEXT_PUBLIC_LEMONSQUEEZY_AFFILIATE_SIGNUP_URL ||
    "https://clienteasily.lemonsqueezy.com/affiliates";

  function friendlyError(err: any) {
    const code = err?.code || "";

    if (
      code ===
      "auth/email-already-in-use"
    ) {
      return "An account already exists with this email.";
    }

    if (
      code === "auth/weak-password"
    ) {
      return "Password must be at least 8 characters.";
    }

    if (
      code === "auth/invalid-email"
    ) {
      return "Please enter a valid email address.";
    }

    if (
      code ===
      "auth/popup-closed-by-user"
    ) {
      return "Google sign-in window was closed.";
    }

    if (
      code === "auth/popup-blocked"
    ) {
      return "Your browser blocked the Google sign-in popup.";
    }

    if (
      code ===
      "auth/unauthorized-domain"
    ) {
      return "This website domain is not authorized in Firebase Authentication.";
    }

    if (
      code ===
      "auth/operation-not-allowed"
    ) {
      return "Google sign-in is not enabled in Firebase yet.";
    }

    return (
      err?.message?.replace(
        "Firebase: ",
        ""
      ) ||
      "Could not create creator account."
    );
  }

  async function saveCreator(
    user: any,
    displayName: string
  ) {
    const profileRef =
      doc(db, "profiles", user.uid);

    const existingProfile =
      await getDoc(profileRef);

    if (
      existingProfile.exists() &&
      existingProfile.data()?.role &&
      existingProfile.data()?.role !==
        "creator"
    ) {
      throw new Error(
        "This account is already registered as a business account."
      );
    }

    await setDoc(
      profileRef,
      {
        id: user.uid,
        full_name:
          displayName ||
          user.displayName ||
          "",
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
            displayName ||
            user.displayName ||
            "",
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
  }

  async function signup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const credential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await updateProfile(
        credential.user,
        {
          displayName:
            name.trim(),
        }
      );

      await saveCreator(
        credential.user,
        name.trim()
      );

      window.location.href =
        affiliateUrl;
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function signupWithGoogle() {
    setGoogleBusy(true);
    setError("");

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

      try {
        await saveCreator(
          result.user,
          result.user.displayName || ""
        );
      } catch (err) {
        await signOut(auth);
        throw err;
      }

      window.location.href =
        affiliateUrl;
    } catch (err: any) {
      setError(friendlyError(err));
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <main className="center">
      <div className="authBox">
        <span className="eyebrow">
          Creator signup
        </span>

        <h1>
          Join the Creator Program.
        </h1>

        <p className="muted">
          Earn 20% recurring commission
          on eligible Starter and Pro
          subscriptions. The $99 setup
          fee is not commissionable.
        </p>

        <button
          type="button"
          className="btn"
          onClick={
            signupWithGoogle
          }
          disabled={
            googleBusy || busy
          }
          style={{
            width: "100%",
            marginTop: 18,
          }}
        >
          {googleBusy
            ? "Creating account…"
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
          onSubmit={signup}
        >
          <label className="label">
            Name

            <input
              className="input"
              required
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </label>

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
              minLength={8}
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </label>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <button
            className="btn primary"
            disabled={
              busy || googleBusy
            }
          >
            {busy
              ? "Creating…"
              : "Create creator account"}
          </button>
        </form>

        <p
          className="muted"
          style={{
            marginTop: 20,
          }}
        >
          Already a creator?{" "}
          <Link href="/auth/login/creator">
            Creator Login
          </Link>
        </p>
      </div>
    </main>
  );
}