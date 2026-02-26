// Native Supabase Google OAuth — Lovable dependency removed
import { supabase } from "../supabase/client";

type SignInOptions = {
  redirect_uri?: string;
};

export const lovable = {
  auth: {
    signInWithOAuth: async (_provider: "google" | "apple", opts?: SignInOptions) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: opts?.redirect_uri ?? window.location.origin + "/onboarding",
        },
      });
      if (error) return { error };
      return { redirected: true };
    },
  },
};
