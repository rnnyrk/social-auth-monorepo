import { StatusBar } from 'expo-status-bar';
import { useSupabaseSocialAuth } from 'expo-supabase-social-auth';
import { StyleSheet, Text } from 'react-native';

import { getApplicationId, isIphone } from '@utils';
import { Button } from '@common/interaction';
import { Container, LogoHeader } from '@common/layout';
import { Apple, Gsuite } from '@common/svg';

export default function AuthScreen() {
  const { loading, onSignInWithApple, onSignInWithGoogle } = useSupabaseSocialAuth();

  return (
    <>
      <StatusBar style="dark" />
      <LogoHeader />
      <Container>
        <Button
          onPress={onSignInWithGoogle}
          isDisabled={loading}
          isLoading={loading}
          style={{ marginBottom: 16, width: '100%' }}
          icon={
            <Gsuite
              width={19}
              height={19}
            />
          }
        >
          <Text>Sign in with Google</Text>
        </Button>
        {isIphone && (
          <Button
            onPress={onSignInWithApple}
            isDisabled={loading}
            isLoading={loading}
            style={{ width: '100%' }}
            icon={
              <Apple
                width={20}
                height={22}
                style={{ marginTop: -4 }}
              />
            }
          >
            <Text>Sign in with Apple</Text>
          </Button>
        )}

        <Text style={styles.applicationIdText}>{getApplicationId()}</Text>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  applicationIdText: {
    color: '#CCCCCC',
    fontSize: 16,
    marginTop: 32,
  },
});
