import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function Signup() {
  return (
    <main className="center">
      <div className="authBox">
        <span className="eyebrow">
          Business signup
        </span>

        <h1>Start your ClientEasily workspace.</h1>

        <p className="muted">
          Use a business email if you have one. If you do not,
          a normal email is completely fine — no special
          business email is required.
        </p>

        <Suspense
          fallback={
            <p className="muted">
              Loading signup...
            </p>
          }
        >
          <AuthForm mode="signup" />
        </Suspense>

        <p className="muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            style={{ color: "#5146e5" }}
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}