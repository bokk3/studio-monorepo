import { createContext, useContext, useState, useEffect } from 'react';
import { 
  type PilotProfile, 
  type RegisterPilotParams, 
  registerPilot, 
  loginPilot, 
  getActivePilot, 
  logoutPilot,
  isLiveSupabase,
  supabase
} from '@/lib/supabase';

interface AuthContextType {
  pilot: PilotProfile | null;
  isLoading: boolean;
  register: (params: RegisterPilotParams) => Promise<PilotProfile>;
  login: (email: string, password: string) => Promise<PilotProfile>;
  logout: () => Promise<void>;
  refreshPilot: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pilot, setPilot] = useState<PilotProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPilot = async () => {
    try {
      const current = await getActivePilot();
      setPilot(current);
    } catch (err) {
      console.error('Failed to load pilot session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPilot();

    if (isLiveSupabase && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        fetchPilot();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const handleRegister = async (params: RegisterPilotParams) => {
    setIsLoading(true);
    try {
      const newPilot = await registerPilot(params);
      setPilot(newPilot);
      return newPilot;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedPilot = await loginPilot(email, password);
      setPilot(loggedPilot);
      return loggedPilot;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutPilot();
      setPilot(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        pilot,
        isLoading,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        refreshPilot: fetchPilot
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
