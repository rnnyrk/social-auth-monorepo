import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SupabaseSocialAuthProvider } from 'expobase-social-auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getApplicationId } from '@utils';
import { supabase } from '@utils/supabase';

const applicationId = getApplicationId();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SupabaseSocialAuthProvider
        onLoginError={() => {}}
        onLoginSuccess={() => {}}
        applicationId={applicationId!}
        loggedInRoute="/home/"
        loggedOutRoute="/"
        supabaseClient={supabase}
      >
        <StatusBar style="dark" />
        <Stack
          initialRouteName="index"
          screenOptions={{ header: () => null }}
        />
      </SupabaseSocialAuthProvider>
    </SafeAreaProvider>
  );
}
