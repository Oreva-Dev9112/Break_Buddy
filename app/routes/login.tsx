/**
 * Profile setup route
 *
 * Break Buddy has no accounts. This asks for a first name so the app can greet
 * you, and whether you're using it for yourself or with a team, then writes a
 * profile to this browser's localStorage. Nothing is sent anywhere.
 *
 * The route is still /login so existing links keep working. If someone already
 * has a local profile they go straight through to the dashboard.
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "@remix-run/react";
import { useProfile } from "~/contexts/ProfileContext";
import type { UserType } from "~/lib/store";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { profile, ready, createProfile } = useProfile();
  const [searchParams] = useSearchParams();

  const initialType = (searchParams.get("type") as UserType) || "individual";
  const [userType, setUserType] = useState<UserType>(initialType);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Already set up on this device: skip straight through.
  useEffect(() => {
    if (ready && profile) navigate("/dashboard", { replace: true });
  }, [ready, profile, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("What should we call you?");
      return;
    }

    createProfile(name, userType);
    navigate("/dashboard");
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
          <h1 className="text-2xl font-bold text-white">Let&apos;s set you up</h1>
          <p className="text-sm text-purple-200 mt-1">
            No account, no password. This stays on your device.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/10 border border-red-300/30 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm text-purple-200 mb-1">
              First name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-4 py-3 placeholder-purple-200/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Alex"
              required
            />
          </div>

          <div>
            <span className="block text-sm text-purple-200 mb-2">
              Who are you planning breaks for?
            </span>
            <div className="flex bg-white/10 rounded-xl p-1">
              {(["individual", "corporate"] as UserType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUserType(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    userType === t
                      ? "bg-white/20 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                >
                  {t === "individual" ? "Just me" : "My team"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start taking breaks
          </button>
        </form>

        <p className="mt-5 text-xs text-purple-200/70 text-center leading-relaxed">
          Your name and plans are stored in this browser only. Clearing your
          browser data removes them.
        </p>

        <div className="mt-5 text-center">
          <Link to="/" className="text-sm text-purple-200 hover:text-white">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
