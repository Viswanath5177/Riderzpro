import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import riderImg from "@/assets/rider.jpg";
import { Logo } from "@/components/site/bits";
import { useAuth } from "@/lib/auth";
import { isDevAdminEnabled } from "@/components/dev/AdminDevBypass";

export function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

interface AuthPageProps {
  initialMode?: "signin" | "signup";
  redirectPath?: string;
}

export function AuthPage({ initialMode = "signin", redirectPath }: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Sync mode with prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const targetPath = redirectPath || "/dashboard/customer";

  // If already authenticated, redirect to target
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate({ to: targetPath });
    }
  }, [loading, isAuthenticated, navigate, targetPath]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background font-sans">
      {/* Left Column: Hero image with dark gradient and tagline (hidden on mobile <=768px) */}
      <div className="relative hidden lg:block overflow-hidden bg-zinc-950">
        <img
          src={riderImg}
          alt="Riderzpro delivery rider"
          width={1280}
          height={896}
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        
        <div className="absolute top-10 left-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Official EV Rider Network
          </span>
        </div>

        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-display text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Every part.<br />Every rider.<br />One app.
          </p>
          <p className="mt-4 max-w-md text-sm text-zinc-300 leading-relaxed font-normal">
            Direct access to verified EV batteries, parts that match your VIN, and real-time tracked doorstep delivery across India.
          </p>
        </div>
      </div>

      {/* Right Column: Auth form card */}
      <div className="flex flex-col min-h-screen p-5 sm:p-8 md:p-12 lg:p-14 overflow-y-auto">
        {/* Header: Logo and AI Assistant Pill */}
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/assistant"
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-2xs transition hover:bg-primary hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Assistant</span>
          </Link>
        </div>

        {/* Center Container */}
        <div className="my-auto py-8 sm:py-12 mx-auto w-full max-w-md">
          {/* Segmented Role Switcher: Customer | Vendor */}
          <div className="mb-5 flex items-center justify-center p-1 rounded-2xl bg-muted border border-border">
            <button
              type="button"
              className="flex-1 rounded-xl py-2 text-xs font-bold transition bg-white text-primary shadow-xs cursor-default"
            >
              Customer
            </button>
            <Link
              to="/vendor/auth"
              className="flex-1 text-center rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
            >
              Vendor
            </Link>
          </div>

          {mode === "signin" ? (
            <SignInForm
              onSwitchToSignUp={() => setMode("signup")}
              targetPath={targetPath}
            />
          ) : (
            <SignUpForm
              onSwitchToSignIn={() => setMode("signin")}
              targetPath={targetPath}
            />
          )}

          {/* Become a vendor link */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <span>Selling EV parts? </span>
            <Link to="/vendor/auth" search={{ mode: "signup" }} className="font-semibold text-primary hover:underline">
              Become a RiderzPro vendor →
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-6 text-center text-xs text-muted-foreground border-t border-border/40">
          <p>© 2026 Riderzpro · Safe & secure customer authentication</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SIGN IN FORM
// ---------------------------------------------------------------------------
interface SignInFormProps {
  onSwitchToSignUp: () => void;
  targetPath: string;
}

export function SignInForm({ onSwitchToSignUp, targetPath }: SignInFormProps) {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {};
    const trimmed = identifier.trim();

    if (!trimmed) {
      newErrors.identifier = "Please enter your email or 10-digit mobile number.";
    } else if (trimmed.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        newErrors.identifier = "Please enter a valid email address.";
      }
    } else {
      const cleanPhone = trimmed.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        newErrors.identifier = "Please enter a valid 10-digit phone number.";
      }
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await signIn(identifier, password, rememberMe);
      if (res.success) {
        toast.success("Welcome back!", {
          description: "Signed in successfully to your Riderzpro account.",
        });
        navigate({ to: targetPath });
      } else {
        toast.error("Invalid email or password", {
          description: res.error || "Please check your credentials and try again.",
        });
        setErrors((prev) => ({
          ...prev,
          password: "The password or identifier you entered does not match.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        toast.success("Welcome back!", {
          description: "Signed in with Google successfully.",
        });
        navigate({ to: targetPath });
      } else {
        toast.error("Google sign in failed", { description: res.error });
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your Riderzpro account.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email or Phone Field */}
        <div>
          <label
            htmlFor="signin-identifier"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
          >
            Email or Phone Number
          </label>
          <div className="relative">
            <input
              id="signin-identifier"
              type="text"
              autoFocus
              autoComplete="username"
              placeholder="name@example.com or 9876543210"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
              }}
              aria-invalid={Boolean(errors.identifier)}
              aria-describedby={errors.identifier ? "signin-identifier-error" : undefined}
              className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
                errors.identifier ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
          </div>
          {errors.identifier && (
            <p id="signin-identifier-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="signin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "signin-password-error" : undefined}
              className={`w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
                errors.password ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="signin-password-error" className="mt-1.5 text-xs font-medium text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              id="signin-remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span className="text-xs text-muted-foreground">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary Green Submit Button */}
        <button
          type="submit"
          id="signin-submit-btn"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>

        {/* Divider "or" */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/80" />
          </div>
          <span className="relative bg-white dark:bg-card px-3 text-xs uppercase text-muted-foreground font-medium">
            or
          </span>
        </div>

        {/* Continue with Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background hover:bg-muted/60 py-2.5 px-4 text-sm font-semibold text-foreground transition active:scale-[0.99] disabled:opacity-60"
        >
          {isGoogleSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          <span>Continue with Google</span>
        </button>

        {/* Demo Credentials Helper Pill */}
        <div className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-2.5 text-xs text-emerald-800 dark:text-emerald-200">
          <p className="font-semibold">Demo Customer credentials:</p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
            Email: <code className="font-mono font-semibold">aakash@riderzpro.com</code> · Password: <code className="font-mono font-semibold">Password123</code>
          </p>
        </div>


      </form>

      {/* Footer Switcher */}
      <div className="mt-6 pt-5 text-center text-sm border-t border-border/60">
        <span className="text-muted-foreground">New to Riderzpro? </span>
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-primary hover:underline ml-1"
        >
          Create an account
        </button>
      </div>

      {/* Forgot Password Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold">Reset Password</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Enter your email and we'll send you a password reset link.
            </p>
            <input
              type="email"
              placeholder="name@example.com"
              defaultValue={identifier.includes("@") ? identifier : ""}
              className="mt-4 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  toast.success("Password reset instructions sent", {
                    description: "Check your email for the reset link.",
                  });
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Send instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SIGN UP FORM
// ---------------------------------------------------------------------------
interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  targetPath: string;
}

export function SignUpForm({ onSwitchToSignIn, targetPath }: SignUpFormProps) {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
      agreeTerms?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email format.";
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Please enter your 10-digit phone number.";
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Password min 8 chars with at least 1 letter and 1 number
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password = "Password must include at least one letter and one number.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "You must accept the Terms & Privacy Policy.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await signUp({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (res.success) {
        toast.success("Account created!", {
          description: "Welcome to Riderzpro. You're now signed in.",
        });
        navigate({ to: targetPath });
      } else {
        toast.error("Sign up failed", { description: res.error });
        if (res.error?.includes("email")) {
          setErrors((prev) => ({ ...prev, email: res.error }));
        } else if (res.error?.includes("phone")) {
          setErrors((prev) => ({ ...prev, phone: res.error }));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        toast.success("Welcome!", {
          description: "Signed up with Google successfully.",
        });
        navigate({ to: targetPath });
      } else {
        toast.error("Google sign in failed", { description: res.error });
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Get parts that fit, delivered by riders you can track.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="signup-name"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoFocus
            autoComplete="name"
            placeholder="Aakash Sharma"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "signup-name-error" : undefined}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
              errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.name && (
            <p id="signup-name-error" className="mt-1 text-xs font-medium text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
          >
            Email Address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="aakash@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
            className={`w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
              errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.email && (
            <p id="signup-email-error" className="mt-1 text-xs font-medium text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number with +91 prefix */}
        <div>
          <label
            htmlFor="signup-phone"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
          >
            Phone Number
          </label>
          <div className="relative flex rounded-xl border border-border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <span className="inline-flex items-center px-3.5 bg-muted/60 text-xs font-bold text-foreground border-r border-border select-none">
              +91
            </span>
            <input
              id="signup-phone"
              type="tel"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => {
                const numOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(numOnly);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "signup-phone-error" : undefined}
              className="w-full bg-transparent px-3.5 py-2.5 text-sm outline-none"
            />
          </div>
          {errors.phone && (
            <p id="signup-phone-error" className="mt-1 text-xs font-medium text-destructive">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="signup-password"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min 8 chars, 1 letter & 1 number"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "signup-password-error" : undefined}
              className={`w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
                errors.password ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="signup-password-error" className="mt-1 text-xs font-medium text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="signup-confirm-password"
            className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
              className={`w-full rounded-xl border bg-background px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
                errors.confirmPassword ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="signup-confirm-password-error" className="mt-1 text-xs font-medium text-destructive">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              id="signup-terms"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
              }}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary shrink-0"
            />
            <span className="text-xs text-muted-foreground leading-normal">
              I agree to the{" "}
              <span className="text-foreground font-medium underline">Terms of Service</span> and{" "}
              <span className="text-foreground font-medium underline">Privacy Policy</span>.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs font-medium text-destructive">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Primary Green Submit Button */}
        <button
          type="submit"
          id="signup-submit-btn"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create account</span>
          )}
        </button>

        {/* Divider "or" */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/80" />
          </div>
          <span className="relative bg-white dark:bg-card px-3 text-xs uppercase text-muted-foreground font-medium">
            or
          </span>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-background hover:bg-muted/60 py-2.5 px-4 text-sm font-semibold text-foreground transition active:scale-[0.99] disabled:opacity-60"
        >
          {isGoogleSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <GoogleIcon className="h-4 w-4" />
          )}
          <span>Continue with Google</span>
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="mt-6 pt-5 text-center text-sm border-t border-border/60">
        <span className="text-muted-foreground">Already have an account? </span>
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-primary hover:underline ml-1"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
