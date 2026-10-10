import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface PilotProfile {
  id: string;
  callsign: string;
  email: string;
  faction: 'Aero-Dynamics' | 'Vanguard' | 'Solar Pulse';
  rankTier: string;
  clearanceLevel: string;
  diamondsBalance: number;
  goldBalance: number;
  founderStatus: boolean;
  avatarSeed: string;
  referralCode: string;
  createdAt: string;
}

export interface RegisterPilotParams {
  email: string;
  password: string;
  callsign: string;
  faction: 'Aero-Dynamics' | 'Vanguard' | 'Solar Pulse';
  referralCode?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback storage key
const LOCAL_PILOT_KEY = 'tachyon_active_pilot';
const LOCAL_PILOT_REGISTRY = 'tachyon_pilot_registry';

/**
 * Check if a callsign is available
 */
export async function checkCallsignAvailability(callsign: string): Promise<boolean> {
  const clean = callsign.trim().toLowerCase();
  if (clean.length < 3 || clean.length > 20) return false;

  // Reserved callsigns
  const reserved = ['admin', 'system', 'root', 'tachyon', 'moderator', 'null', 'undefined'];
  if (reserved.includes(clean)) return false;

  if (isLiveSupabase && supabase) {
    try {
      const { data, error } = await supabase.rpc('check_callsign_available', {
        target_callsign: clean
      });
      if (!error && typeof data === 'boolean') return data;

      // Fallback query
      const { data: rows } = await supabase
        .from('profiles')
        .select('id')
        .ilike('callsign', clean)
        .limit(1);

      return !rows || rows.length === 0;
    } catch {
      // Fallback to local
    }
  }

  // Local simulated registry
  const registryStr = localStorage.getItem(LOCAL_PILOT_REGISTRY);
  const registry: Record<string, string> = registryStr ? JSON.parse(registryStr) : {};
  return !registry[clean];
}

/**
 * Register a new pilot profile
 */
export async function registerPilot(params: RegisterPilotParams): Promise<PilotProfile> {
  const { email, password, callsign, faction, referralCode } = params;

  if (isLiveSupabase && supabase) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          callsign: callsign.trim(),
          faction,
          referral_code: referralCode?.trim() || null
        }
      }
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Pilot enlistment failed: User record could not be provisioned.");

    // Fetch newly created profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!profileError && profileData) {
      return {
        id: profileData.id,
        callsign: profileData.callsign,
        email: profileData.email,
        faction: profileData.faction,
        rankTier: profileData.rank_tier,
        clearanceLevel: profileData.clearance_level,
        diamondsBalance: profileData.diamonds_balance,
        goldBalance: profileData.gold_balance,
        founderStatus: profileData.founder_status,
        avatarSeed: profileData.avatar_seed,
        referralCode: profileData.referral_code,
        createdAt: profileData.created_at
      };
    }
  }

  // High-performance Local Pilot Enlistment (Simulated Pilot Engine)
  const cleanCallsign = callsign.trim();
  const pilotId = 'pilot_' + Math.random().toString(36).substring(2, 10);
  const uniqueRef = 'TACH-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const newPilot: PilotProfile = {
    id: pilotId,
    callsign: cleanCallsign,
    email,
    faction,
    rankTier: 'Ensign',
    clearanceLevel: 'ALPHA-FOUNDER',
    diamondsBalance: referralCode ? 750 : 500, // 250 bonus diamonds if referred
    goldBalance: 2500,
    founderStatus: true,
    avatarSeed: 'pilot-' + Math.floor(Math.random() * 10 + 1),
    referralCode: uniqueRef,
    createdAt: new Date().toISOString()
  };

  // Save to local storage
  localStorage.setItem(LOCAL_PILOT_KEY, JSON.stringify(newPilot));

  // Register in callsign lookup
  const registryStr = localStorage.getItem(LOCAL_PILOT_REGISTRY);
  const registry: Record<string, string> = registryStr ? JSON.parse(registryStr) : {};
  registry[cleanCallsign.toLowerCase()] = pilotId;
  localStorage.setItem(LOCAL_PILOT_REGISTRY, JSON.stringify(registry));

  return newPilot;
}

/**
 * Sign in an existing pilot
 */
export async function loginPilot(email: string, password: string): Promise<PilotProfile> {
  if (isLiveSupabase && supabase) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error("Login failed: invalid credentials.");

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) throw new Error("Could not retrieve pilot clearance record.");

    return {
      id: profileData.id,
      callsign: profileData.callsign,
      email: profileData.email,
      faction: profileData.faction,
      rankTier: profileData.rank_tier,
      clearanceLevel: profileData.clearance_level,
      diamondsBalance: profileData.diamonds_balance,
      goldBalance: profileData.gold_balance,
      founderStatus: profileData.founder_status,
      avatarSeed: profileData.avatar_seed,
      referralCode: profileData.referral_code,
      createdAt: profileData.created_at
    };
  }

  // Local simulated login
  const stored = localStorage.getItem(LOCAL_PILOT_KEY);
  if (stored) {
    const pilot = JSON.parse(stored) as PilotProfile;
    if (pilot.email.toLowerCase() === email.toLowerCase()) {
      return pilot;
    }
  }

  // Create recovery pilot if testing with any email
  const fallbackPilot: PilotProfile = {
    id: 'pilot_active',
    callsign: email.split('@')[0].toUpperCase(),
    email,
    faction: 'Aero-Dynamics',
    rankTier: 'Lieutenant',
    clearanceLevel: 'FOUNDER-PILOT',
    diamondsBalance: 500,
    goldBalance: 2500,
    founderStatus: true,
    avatarSeed: 'pilot-1',
    referralCode: 'TACH-FNDR',
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(LOCAL_PILOT_KEY, JSON.stringify(fallbackPilot));
  return fallbackPilot;
}

/**
 * Get the currently logged-in pilot
 */
export async function getActivePilot(): Promise<PilotProfile | null> {
  if (isLiveSupabase && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        return {
          id: data.id,
          callsign: data.callsign,
          email: data.email,
          faction: data.faction,
          rankTier: data.rank_tier,
          clearanceLevel: data.clearance_level,
          diamondsBalance: data.diamonds_balance,
          goldBalance: data.gold_balance,
          founderStatus: data.founder_status,
          avatarSeed: data.avatar_seed,
          referralCode: data.referral_code,
          createdAt: data.created_at
        };
      }
    }
  }

  const stored = localStorage.getItem(LOCAL_PILOT_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Sign out
 */
export async function logoutPilot(): Promise<void> {
  if (isLiveSupabase && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_PILOT_KEY);
}
