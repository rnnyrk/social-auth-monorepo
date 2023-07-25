import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SupabaseSocialAuthProvider } from 'expobase-social-auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';

import theme from '@styles/theme';
import { supabase } from '@utils/supabase';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <SupabaseSocialAuthProvider
          onLoginError={() => {}}
          onLoginSuccess={() => {}}
          applicationId="test.expobase"
          loggedInRoute="/"
          loggedOutRoute="/home/"
          supabaseClient={supabase}
        >
          <StatusBar style="dark" />
          <Stack
            initialRouteName="index"
            screenOptions={{ header: () => null }}
          />
        </SupabaseSocialAuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
