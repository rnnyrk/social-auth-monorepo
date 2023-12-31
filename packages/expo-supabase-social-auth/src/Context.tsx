import * as React from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import {
  type SupabaseReducerState,
  type SupabaseSocialAuthContextProps,
  type SupabaseSocialAuthProviderProps,
  type SupabaseUserType,
} from './index.d';
import { createUser, extractParamsFromUrl, getUserByEmail, supabaseReducer } from './utils';

declare module 'jwt-decode' {
  export interface JwtPayload {
    email: string;
    name: string;
  }
}

const SupabaseSocialAuthContext = React.createContext<SupabaseSocialAuthContextProps>({
  loading: false,
  loggedIn: false,
  user: null,
  signOut: async () => {},
  onSignInWithApple: async () => {},
  onSignInWithGoogle: async () => {},
  setOAuthSession: async () => {},
});

export function useSupabaseSocialAuth() {
  return React.useContext(SupabaseSocialAuthContext);
}

function useProtectedRoute(user: SupabaseUserType, redirects: SupabaseReducerState['redirect']) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (user === undefined || !redirects.loggedInRoute || !redirects.loggedOutRoute) return;

    const rootSegment = segments[0];
    const isAppDir = rootSegment === undefined;

    // If the user is not signed in, and not on signin page
    if (!user) {
      router.replace(redirects.loggedOutRoute);
    } else if (user && isAppDir) {
      router.replace(redirects.loggedInRoute);
    }
  }, [user, segments, redirects.loggedInRoute, redirects.loggedOutRoute]);
}

export function SupabaseSocialAuthProvider({
  children,
  onLoginError,
  onLoginSuccess,
  applicationId,
  loggedInRoute,
  loggedOutRoute,
  supabaseClient,
}: SupabaseSocialAuthProviderProps) {
  const [state, dispatch] = React.useReducer(supabaseReducer, {
    loading: false,
    loggedIn: false,
    user: undefined,
    redirect: {
      applicationId: undefined,
      loggedInRoute: undefined,
      loggedOutRoute: '/',
    },
  });

  React.useEffect(() => {
    const applicationIdRegex = new RegExp('^(^[a-z0-9]+(.[a-z0-9]+)+(:+/+/+)?).*$');
    if (!applicationIdRegex.test(applicationId)) {
      throw Error('Invalid applicationId, provide like: test.app OR test.app://');
    } else {
      const cleanApplicationId = applicationId.includes('://')
        ? applicationId.split('://')[0]
        : applicationId;

      dispatch({
        type: 'set_bundle_id',
        payload: {
          applicationId: cleanApplicationId,
          loggedInRoute,
          loggedOutRoute: loggedOutRoute || '/',
        },
      });
    }
  }, [applicationId, loggedInRoute, loggedOutRoute]);

  React.useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  async function getSupabaseUser(token: string) {
    const decodedToken = jwt_decode(token) as JwtPayload;
    const email = decodedToken.email;
    const name = decodedToken.name;

    // Fetch the user from Supabase, if not existing, create a new user
    const data = await getUserByEmail({ email, supabaseClient });

    if (data) {
      dispatch({
        type: 'set_user',
        payload: data,
      });
    } else if (!data) {
      const newUser = await createUser({
        supabaseClient,
        email,
        name,
      });

      if (newUser) {
        dispatch({
          type: 'set_user',
          payload: newUser,
        });
      }
    }
  }

  // Check if the user still has an exisiting session
  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        onLoginError && onLoginError(error);
        throw error;
      }

      if (data.session) {
        await getSupabaseUser(data.session.access_token);
        dispatch({
          type: 'set_login',
          payload: true,
        });
      }
    })();
  }, [onLoginError]);

  async function onSignInWithApple() {
    dispatch({
      type: 'set_loading',
      payload: true,
    });

    const redirectTo = `${state.redirect.applicationId}:/${state.redirect.loggedInRoute || '/'}`;

    try {
      const oAuthResult = await supabaseClient.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo,
          scopes: 'full_name email',
        },
      });

      const url = oAuthResult.data.url;
      if (!url) return;

      const result = await WebBrowser.openAuthSessionAsync(url, redirectTo, {
        showInRecents: true,
      });

      if (result.type === 'success') {
        const data = extractParamsFromUrl(result.url);

        if (!data.access_token || !data.refresh_token) return;

        setOAuthSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        onLoginSuccess && onLoginSuccess(data);
      }
    } catch (error) {
      console.error(error);
      onLoginError && onLoginError(error);
    } finally {
      dispatch({
        type: 'set_loading',
        payload: false,
      });
    }
  }

  async function onSignInWithGoogle() {
    dispatch({
      type: 'set_loading',
      payload: true,
    });

    const redirectTo = `${state.redirect.applicationId}:/${state.redirect.loggedInRoute || '/'}`;

    try {
      const oAuthResult = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      const url = oAuthResult.data.url;
      if (!url) return;

      const result = await WebBrowser.openAuthSessionAsync(url, redirectTo, {
        showInRecents: true,
      });

      if (result.type === 'success') {
        const data = extractParamsFromUrl(result.url);

        if (!data.access_token || !data.refresh_token) return;

        setOAuthSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        onLoginSuccess && onLoginSuccess(data);
      }
    } catch (error) {
      console.error(error);
      onLoginError && onLoginError(error);
    } finally {
      dispatch({
        type: 'set_loading',
        payload: false,
      });
    }
  }

  async function setOAuthSession(tokens: { access_token: string; refresh_token: string }) {
    const { data, error } = await supabaseClient.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    if (error) {
      onLoginError && onLoginError(error);
      throw error;
    }

    await getSupabaseUser(tokens.access_token);

    dispatch({
      type: 'set_login',
      payload: data.session !== null,
    });
  }

  async function signOut() {
    const { error } = await supabaseClient.auth.signOut();

    dispatch({
      type: 'set_user',
      payload: null,
    });

    dispatch({
      type: 'set_login',
      payload: false,
    });

    if (error) throw error;
  }

  useProtectedRoute(state.user, state.redirect);

  return (
    <SupabaseSocialAuthContext.Provider
      value={{
        loading: state.loading,
        loggedIn: state.loggedIn,
        user: state.user,
        signOut,
        onSignInWithApple,
        onSignInWithGoogle,
        setOAuthSession,
      }}
    >
      {children}
    </SupabaseSocialAuthContext.Provider>
  );
}
