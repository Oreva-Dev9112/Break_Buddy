/**
 * Profile context
 *
 * Replaces the old AuthContext. There are no accounts and no sign-in: this
 * holds the local profile and break plans from ~/lib/store and keeps them in
 * sync across the app.
 *
 * Because the store is localStorage, nothing can be read during server-side
 * render. `ready` is false until the first client-side effect has run, so
 * routes should wait on it rather than assuming "no profile" on first paint.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  addBreakPlan as addPlan,
  clearAll,
  createProfile as makeProfile,
  getBreakPlans,
  getProfile,
  removeBreakPlan as removePlan,
  setBreakDone as markPlan,
  updateProfile as saveProfile,
  type BreakKind,
  type BreakPlan,
  type Profile,
  type UserType,
} from "~/lib/store";

interface ProfileContextType {
  profile: Profile | null;
  breakPlans: BreakPlan[];
  /** False until localStorage has been read in the browser. */
  ready: boolean;
  createProfile: (fullName: string, userType: UserType) => Profile;
  updateProfile: (updates: Partial<Profile>) => void;
  addBreakPlan: (input: {
    title: string;
    kind: BreakKind;
    minutes: number;
    starts_at: string;
  }) => void;
  setBreakDone: (planId: string, done: boolean) => void;
  removeBreakPlan: (planId: string) => void;
  /** Wipes the local profile and plans. */
  forgetMe: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [breakPlans, setBreakPlans] = useState<BreakPlan[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setBreakPlans(getBreakPlans());
    setReady(true);
  }, []);

  const createProfile = useCallback((fullName: string, userType: UserType) => {
    const created = makeProfile(fullName, userType);
    setProfile(created);
    return created;
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(saveProfile(updates));
  }, []);

  const addBreakPlan = useCallback(
    (input: { title: string; kind: BreakKind; minutes: number; starts_at: string }) => {
      addPlan(input);
      setBreakPlans(getBreakPlans());
    },
    [],
  );

  const setBreakDone = useCallback((planId: string, done: boolean) => {
    setBreakPlans(markPlan(planId, done));
  }, []);

  const removeBreakPlan = useCallback((planId: string) => {
    setBreakPlans(removePlan(planId));
  }, []);

  const forgetMe = useCallback(() => {
    clearAll();
    setProfile(null);
    setBreakPlans([]);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      breakPlans,
      ready,
      createProfile,
      updateProfile,
      addBreakPlan,
      setBreakDone,
      removeBreakPlan,
      forgetMe,
    }),
    [
      profile,
      breakPlans,
      ready,
      createProfile,
      updateProfile,
      addBreakPlan,
      setBreakDone,
      removeBreakPlan,
      forgetMe,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
