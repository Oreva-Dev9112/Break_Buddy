/**
 * Login and sign-up route
 *
 * Supports email/password and Google OAuth. We read an optional `type` query
 * param (individual|corporate) so future flows can customize onboarding.
 *
 * Team notes:
 * - Consider adding password reset and magic link flows later.
 * - Keep validation friendly; we surface simple error messages to users.
 */
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import { useAuth } from "~/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const userTypeParam = (searchParams.get("type") as "individual" | "corporate") || "individual";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message || "Failed to sign in");
      return;
      }
      navigate("/dashboard");
    } else {
      const { error } = await signUp(email, password, { user_type: userTypeParam });
      if (error) {
        setError(error.message || "Failed to sign up");
        return;
      }
      navigate("/dashboard");
    }
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error.message || "Google sign-in failed");
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, rgb(50, 46, 58) 0%, rgb(63, 56, 76) 35%, #2d3748 65%, #1a202c 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm text-purple-200 mt-1 capitalize">{userTypeParam} account</p>
        </div>

        <div className="flex mb-4 bg-white/10 rounded-xl p-1">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signin" ? "bg-white/20 text-white" : "text-purple-200 hover:text-white"
            }`}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signup" ? "bg-white/20 text-white" : "text-purple-200 hover:text-white"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/10 border border-red-300/30 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="email" className="block text-sm text-purple-200 mb-1">Email</label>
              <input
              id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-4 py-3 placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
                required
              />
            </div>
            <div>
            <label htmlFor="password" className="block text-sm text-purple-200 mb-1">Password</label>
              <input
              id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-4 py-3 placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
                  required
                />
              </div>
            <button
              type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
            >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-xs text-purple-200">or</span>
          <div className="h-px bg-white/20 flex-1" />
            </div>

              <button
          onClick={handleGoogle}
          className="w-full bg-white text-gray-800 hover:bg-gray-100 py-3 rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
            s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.043,6.053,28.715,4,24,4C12.955,4,4,12.955,4,24
            s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.129,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
            C33.043,6.053,28.715,4,24,4C16.318,4,9.514,8.227,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c4.646,0,8.902-1.793,12.098-4.71l-5.59-4.727C28.492,36.884,26.345,38,24,38
            c-5.202,0-9.619-3.317-11.281-7.946l-6.49,5.006C9.46,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.794,2.241-2.231,4.166-4.098,5.563
            c0.001-0.001,0.002-0.001,0.003-0.002l6.49,5.006C37.42,39.584,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-purple-200 hover:text-white">
          ← Back to home
        </Link>
        </div>
      </div>
    </main>
  );
} 


