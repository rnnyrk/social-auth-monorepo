import { SupabaseClient } from '@supabase/supabase-js';

// Add `export {}` here to shut off automatic exporting from index.d.ts. There
// are quite a few utility types here that don't need to be shipped with the
// exported module.
export {};

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
    loggedInRoute: string;
    loggedOutRoute: string;
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
    loggedInRoute: string | undefined;
    loggedOutRoute: string | undefined;
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
  onLoginError?: (error: unknown) => void;
  onLoginSuccess?: (payload: AuthToken) => void;
  bundleId: string;
  loggedInRoute: string;
  loggedOutRoute?: string;
  supabaseClient: SupabaseClient;
};

export function useSupabase(): SupabaseContextProps;
export function SupabaseProvider(props: SupabaseProviderProps): React.JSX.Element;
