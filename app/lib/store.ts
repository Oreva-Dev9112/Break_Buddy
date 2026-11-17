/**
 * Local store — the whole backend.
 *
 * Break Buddy keeps everything on the device. There is no server, no database
 * and no account: your profile and your break plans live in this browser's
 * localStorage and never leave it.
 *
 * Why: the app does not need anyone's email address to help them take a break,
 * and not collecting one removes a whole class of problem (auth, GDPR, hosting
 * costs, leaked keys). If shared plans are ever wanted, that is the point at
 * which to add a server — not before.
 *
 * Note: this is a store, not a security boundary. Anything here is readable by
 * anyone with the device. Don't put secrets in it.
 */

const PROFILE_KEY = "bb.profile.v1";
const PLANS_KEY = "bb.plans.v1";

export type UserType = "individual" | "corporate";
export type BreakKind = "short" | "lunch" | "walk" | "long";

export interface Profile {
  id: string;
  full_name: string;
  user_type: UserType;
  work_days_count: number;
  last_break_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BreakPlan {
  id: string;
  title: string;
  kind: BreakKind;
  minutes: number;
  starts_at: string;
  done: boolean;
  created_at: string;
}

/* ------------------------------------------------------------------ */

function canStore(): boolean {
  // False during server-side render, and in browsers with storage disabled.
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function read<T>(key: string, fallback: T): T {
  if (!canStore()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // Corrupt or unparseable: treat as empty rather than crashing the app.
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or private mode. Nothing useful to do; keep the UI alive.
  }
}

function id(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------------------------- profile ----------------------------- */

export function getProfile(): Profile | null {
  return read<Profile | null>(PROFILE_KEY, null);
}

export function createProfile(full_name: string, user_type: UserType): Profile {
  const now = new Date().toISOString();
  const profile: Profile = {
    id: id(),
    full_name: full_name.trim() || "Friend",
    user_type,
    work_days_count: 0,
    last_break_date: null,
    created_at: now,
    updated_at: now,
  };
  write(PROFILE_KEY, profile);
  return profile;
}

export function updateProfile(updates: Partial<Profile>): Profile | null {
  const current = getProfile();
  if (!current) return null;
  const next: Profile = {
    ...current,
    ...updates,
    id: current.id,
    created_at: current.created_at,
    updated_at: new Date().toISOString(),
  };
  write(PROFILE_KEY, next);
  return next;
}

/** Forget everything about this person on this device. */
export function clearAll(): void {
  if (!canStore()) return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
    window.localStorage.removeItem(PLANS_KEY);
  } catch {
    /* nothing to do */
  }
}

/* --------------------------- break plans -------------------------- */

export function getBreakPlans(): BreakPlan[] {
  const plans = read<BreakPlan[]>(PLANS_KEY, []);
  return Array.isArray(plans)
    ? plans.slice().sort((a, b) => a.starts_at.localeCompare(b.starts_at))
    : [];
}

export function addBreakPlan(
  input: Omit<BreakPlan, "id" | "created_at" | "done">,
): BreakPlan {
  const plan: BreakPlan = {
    ...input,
    id: id(),
    done: false,
    created_at: new Date().toISOString(),
  };
  write(PLANS_KEY, [...getBreakPlans(), plan]);
  return plan;
}

export function setBreakDone(planId: string, done: boolean): BreakPlan[] {
  const next = getBreakPlans().map((p) => (p.id === planId ? { ...p, done } : p));
  write(PLANS_KEY, next);
  return next;
}

export function removeBreakPlan(planId: string): BreakPlan[] {
  const next = getBreakPlans().filter((p) => p.id !== planId);
  write(PLANS_KEY, next);
  return next;
}
