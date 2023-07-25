import * as React from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import {
  type SupabaseContextProps,
  type SupabaseProviderProps,
  type SupabaseReducerActions,
  type SupabaseReducerState,
  type SupabaseUserType,
} from './index.d';

declare module 'jwt-decode' {
  export interface JwtPayload {
    email: string;
    name: string;
  }
}

export const SupabaseContext = React.createContext<SupabaseContextProps>({
  loading: false,
  loggedIn: false,
  user: null,
  signOut: async () => {},
  onSignInWithApple: async () => {},
  onSignInWithGoogle: async () => {},
  setOAuthSession: async () => {},
});

export function useSupabase() {
  return React.useContext(SupabaseContext);
}

function extractParamsFromUrl(url: string) {
  const params = new URLSearchParams(url.split('#')[1]);
  const data = {
    access_token: params.get('access_token'),
    expires_in: parseInt(params.get('expires_in') || '0'),
    refresh_token: params.get('refresh_token'),
    token_type: params.get('token_type'),
    provider_token: params.get('provider_token'),
  };

  return data;
}

function useProtectedRoute(user: SupabaseUserType, redirects: SupabaseReducerState['redirect']) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (user === undefined || !redirects.loggedInRedirectUrl || !redirects.logoutRedirectRoute)
      return;

    const rootSegment = segments[0];
    const isAppDir = rootSegment === undefined;

    // If the user is not signed in, and not on signin page
    if (!user) {
      router.replace(redirects.logoutRedirectRoute);
    } else if (user && isAppDir) {
      router.replace(redirects.loggedInRedirectUrl);
    }
  }, [user, segments]);
}

function supabaseReducer(state: SupabaseReducerState, action: SupabaseReducerActions) {
  if (action.type === 'set_login') {
    return {
      ...state,
      loggedIn: action.payload,
    };
  } else if (action.type === 'set_loading') {
    return {
      ...state,
      loading: action.payload,
    };
  } else if (action.type === 'set_user') {
    return {
      ...state,
      user: action.payload,
    };
  } else if (action.type === 'set_bundle_id') {
    return {
      ...state,
      redirect: action.payload,
    };
  }

  throw Error('Unknown supabaseReducer action');
}

export function SupabaseProvider({
  children,
  onLoginError,
  onLoginSuccess,
  redirectUrl,
  logoutRedirectRoute,
  supabaseClient,
}: SupabaseProviderProps) {
  const [state, dispatch] = React.useReducer(supabaseReducer, {
    loading: false,
    loggedIn: false,
    user: undefined,
    redirect: {
      bundleId: undefined,
      loggedInRedirectUrl: undefined,
      logoutRedirectRoute: '/',
    },
  });

  React.useEffect(() => {
    const bundleIdRegex = new RegExp('^(^[a-z0-9]+(.[a-z0-9]+)+:+/+/+).*$');
    if (bundleIdRegex.test(redirectUrl)) {
      throw Error('Invalid redirectUrl, provide like: test.app:// OR test.app://page');
    } else {
      const splittedUrl = redirectUrl.split('://');
      const bundleId = splittedUrl[0];
      const loggedInRedirectUrl = splittedUrl?.[1] ? splittedUrl[1] : `${splittedUrl[0]}://`;

      dispatch({
        type: 'set_bundle_id',
        payload: {
          bundleId,
          loggedInRedirectUrl,
          logoutRedirectRoute: logoutRedirectRoute || '/',
        },
      });
    }
  }, [redirectUrl]);

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
    const data = await getUserByEmail(email);

    if (data) {
      dispatch({
        type: 'set_user',
        payload: data,
      });
    } else if (!data) {
      const { data: newUser, error: newUserError } = await createUser({
        email,
        name,
      });

      if (newUser && !newUserError) {
        dispatch({
          type: 'set_user',
          payload: newUser,
        });
      } else if (newUserError) {
        console.error('Error creating new user', { newUserError });
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
  }, []);

  async function onSignInWithApple() {
    dispatch({
      type: 'set_loading',
      payload: true,
    });

    try {
      const oAuthResult = await supabaseClient.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${redirectUrl}`,
          scopes: 'full_name email',
        },
      });

      const url = oAuthResult.data.url;
      if (!url) return;

      const result = await WebBrowser.openAuthSessionAsync(url, `${redirectUrl}`, {
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

    try {
      const oAuthResult = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectUrl}`,
        },
      });

      const url = oAuthResult.data.url;
      if (!url) return;

      const result = await WebBrowser.openAuthSessionAsync(url, `${redirectUrl}`, {
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
    <SupabaseContext.Provider
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
    </SupabaseContext.Provider>
  );
}
