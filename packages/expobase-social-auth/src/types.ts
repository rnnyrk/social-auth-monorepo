import { SupabaseClient } from '@supabase/supabase-js';

// Reducer
export type SupabaseReducerLoadingAction = {
  type: 'set_loading';
  payload: boolean;
};

export type SupabaseReducerLoginAction = {
  type: 'set_login';
  payload: boolean;
};

export type SupabaseReducerUserAction = {
  type: 'set_user';
  payload: SupabaseUserType;
};

export type SupabaseReducerIdAction = {
  type: 'set_bundle_id';
  payload: {
    bundleId: string;
    loggedInRedirectUrl: string;
    logoutRedirectUrl: string;
  };
};

export type SupabaseReducerActions =
  | SupabaseReducerLoadingAction
  | SupabaseReducerLoginAction
  | SupabaseReducerUserAction
  | SupabaseReducerIdAction;

export type SupabaseReducerState = {
  loggedIn: boolean;
  loading: boolean;
  user: SupabaseUserType;
  redirect: {
    bundleId: string | undefined;
    loggedInRedirectUrl: string | undefined;
    logoutRedirectUrl: string | undefined;
  };
};

// User
export type SupabaseUserType =
  | {
      id: string;
      email: string;
      name: string;
      created_at: string;
    }
  | null
  | undefined;

// Context
export type SupabaseContextProps = Omit<SupabaseReducerState, 'redirect'> & {
  signOut: () => Promise<void>;
  onSignInWithApple: () => Promise<void>;
  onSignInWithGoogle: () => Promise<void>;
  setOAuthSession: (tokens: { access_token: string; refresh_token: string }) => Promise<void>;
};

export type AuthToken = {
  access_token: string | null;
  expires_in: number;
  refresh_token: string | null;
  token_type: string | null;
  provider_token: string | null;
};

export type SupabaseProviderProps = {
  children: React.ReactNode;
  onLoginError: (error: unknown) => void;
  onLoginSuccess: (payload: AuthToken) => void;
  redirectUrl: string;
  logoutRedirectUrl?: string;
  supabaseClient: SupabaseClient;
};

// Overwrites
declare module 'jwt-decode' {
  export interface JwtPayload {
    email: string;
    name: string;
  }
}
