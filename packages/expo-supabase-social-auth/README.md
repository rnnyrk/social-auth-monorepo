# expo-supabase-social-auth

Package for supplying Social Authentication (currently Apple & Google) with Supabase and Expo Router V2. [I've written a blog post](https://rnny.nl/blog/expo-supabase-social-auth) that explains the process of setting up and configuring Google and Apple logins with Supabase.

## Dependencies

This package requires the following dependencies:

- [SupabaseJS](https://supabase.com/docs/reference/javascript/installing)
- [Expo Router V2](https://docs.expo.dev/routing/introduction/)
- [Google/Apple authentication setup](https://rnny.nl/blog/expo-supabase-social-auth)

## Usage

```tsx
// app/index.tsx
import { useSupabaseSocialAuth } from 'expo-supabase-social-auth';

export default function AuthScreen() {
  const { loading, onSignInWithApple, onSignInWithGoogle } = useSupabaseSocialAuth();

  return (
    <SupabaseSocialAuthProvider
      onLoginError={() => {}}
      onLoginSuccess={() => {}}
      applicationId={applicationId!}
      loggedInRoute="/home/"
      loggedOutRoute="/"
      supabaseClient={supabase}
    >
      {children}
    </SupabaseSocialAuthProvider>
  );
}
```

### Props

| Method           | Type                             | Description                                                                                |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| `applicationId`  | `string`                         | bundleId/packageName as e.g. `com.test`                                                    |
| `loggedInRoute`  | `string`                         | Internal route (Expo app dir) to redirect to after successful login                        |
| `loggedOutRoute` | `string`                         | Internal route (Expo app dir) to redirect to after logout                                  |
| `onLoginError`   | `(error: unknown) => void`       | Callback function after login error                                                        |
| `onLoginSuccess` | `(payload: AuthTokens) => void)` | Callback function after login success                                                      |
| `supabaseClient` | `SupabaseClient`                 | [Supabase initialized client](https://supabase.com/docs/reference/javascript/initializing) |
