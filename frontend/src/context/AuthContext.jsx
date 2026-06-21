// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 1. Connect to YOUR Supabase project using keys from .env
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// 2. Create the "shared memory" container
const AuthContext = createContext();

// 3. This wraps your whole app and provides the shared memory
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // who is logged in
  const [loading, setLoading] = useState(true); // are we still checking?

  useEffect(() => {
    // Check if someone is already logged in when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for login/logout events automatically
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup listener when component unmounts
    return () => listener.subscription.unsubscribe();
  }, []);

  // 4. These are the functions/values every component can use
  const value = {
    user,
    loading,
    supabase,
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 5. Easy shortcut — any component calls useAuth() to get user info
export function useAuth() {
  return useContext(AuthContext);
}