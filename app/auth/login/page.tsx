import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function Login() {
  return (
    <main className="center">
      <div className="authBox">
        <span className="eyebrow">
          Business login
        </span>

        <h1>Welcome back.</h1>

        <p className="muted">
          Sign in to manage your ClientEasily AI sales assistant.
        </p>

        <Suspense
          fallback={
            <p className="muted">
              Loading login...
            </p>
          }
        >
          <AuthForm mode="login" />
        </Suspense>

        <p className="muted">
          New here?{" "}
          <Link
            href="/auth/signup"
            style={{ color: "#5146e5" }}
          >
            Start free
          </Link>
        </p>
      </div>
    </main>
  );
}