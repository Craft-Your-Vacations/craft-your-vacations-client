"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { decodeClaims } from "@/lib/supabase/claims";
import { useRouter, useSearchParams } from "next/navigation";
import { Home } from "lucide-react";
import { useToastStore } from "@/stores/useToastStore";
import Logo from "@/public/logo.png";
import LogoText from "@/public/logo_text.png";
import Button from "@/components/Button/Button";
import FormField from "@/components/FormField/FormField";
import AuthCard from "@/components/AuthCard/AuthCard";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";

type Tab = "email" | "google";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useToastStore((s) => s.addToast);
  const [activeTab, setActiveTab] = useState<Tab>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "ServiceUnavailable") {
      addToast({ key: "login", type: "error", message: "Our servers are temporarily unavailable. Please try again later." });
    }
    if (err === "auth") {
      addToast({ key: "login", type: "error", message: "Sign-in failed. Please try again." });
    }
    if (searchParams.get("reset") === "success") {
      addToast({ key: "reset-success", type: "success", message: "Password reset successfully. You can now sign in." });
    }
  }, []);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      addToast({
        key: "login",
        type: "error",
        message: "Invalid email or password.",
      });
      return;
    }

    const role = decodeClaims(data.session?.access_token).user_role;
    // No router.refresh() after replace — it re-renders the current (/login) route before
    // the navigation commits, cancelling it and leaving a blank AuthGuard-null screen.
    router.replace(role === "Admin" ? "/admin" : "/");
  };

  const handleGoogleSignIn = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 md:py-0">
      {/* Mobile: in-flow above card */}
      <div className="w-full max-w-sm mb-4 flex md:hidden">
        <Button variant="secondary" size="sm" href="/">
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>
      {/* Desktop: absolute top-left */}
      <div className="absolute top-4 left-4 hidden md:block">
        <Button variant="secondary" size="sm" href="/">
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>
      <AuthCard>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" className="w-10" />
          <Image src={LogoText} alt="CYV" className="w-28" />
        </div>

        <div className="text-center flex flex-col gap-2">
          <h1 className="text-headline-md text-text">Welcome back</h1>
          <p className="text-body-sm text-text-muted">
            Sign in to continue planning your next journey
          </p>
        </div>

        {/* Tab switcher */}
        <SegmentedControl<Tab>
          options={[
            { label: "Email", value: "email" },
            { label: "Google", value: "google" },
          ]}
          value={activeTab}
          onChange={switchTab}
        />

        {/* Email / Password */}
        {activeTab === "email" && (
          <form
            onSubmit={handleEmailSignIn}
            className="w-full flex flex-col gap-4"
          >
            <FormField
              id="login-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <FormField
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button
              variant="primary"
              size="md"
              type="submit"
              loading={loading}
            >
              Sign in
            </Button>
            <Link
              href="/reset-password"
              className="text-body-sm text-text-muted hover:text-primary transition-colors text-center"
            >
              Forgot password?
            </Link>
          </form>
        )}

        {/* Google */}
        {activeTab === "google" && (
          <Button variant="secondary" onClick={handleGoogleSignIn}>
            <GoogleIcon />
            Continue with Google
          </Button>
        )}

        {/* Footer links */}
        <div className="flex flex-col items-center gap-2 w-full">
          <p className="text-body-sm text-text-subtle text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
          <p className="text-body-sm text-text-subtle text-center">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
}
