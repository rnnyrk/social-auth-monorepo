import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SupabaseProvider } from 'expobase-social-auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components';

import theme from '@styles/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <SupabaseProvider
          onLoginError={() => {}}
          onLoginSuccess={() => {}}
          redirectUrl="com.supabase.expobase://"
          logoutRedirectRoute="/home/"
        >
          <StatusBar style="dark" />
          <Stack
            initialRouteName="index"
            screenOptions={{ header: () => null }}
          />
        </SupabaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
