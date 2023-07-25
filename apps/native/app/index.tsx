import { StatusBar } from 'expo-status-bar';
import { useSupabaseSocialAuth } from 'expobase-social-auth';

import { getApplicationId, isIphone } from '@utils';
import { Button } from '@common/interaction';
import { Container, LogoHeader } from '@common/layout';
import { Apple, Gsuite } from '@common/svg';
import { Text } from '@common/typography';

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
          variant="social"
          style={{ marginBottom: 16, width: '100%' }}
        >
          <Gsuite
            width={19}
            height={19}
            style={{ marginRight: 8 }}
          />
          <Text>{loading ? 'Loading...' : 'Sign in with Google'}</Text>
        </Button>
        {isIphone && (
          <Button
            onPress={onSignInWithApple}
            isDisabled={loading}
            variant="social"
            style={{ width: '100%' }}
          >
            <Apple
              width={20}
              height={22}
              style={{ marginRight: 8 }}
            />
            <Text>{loading ? 'Loading...' : 'Sign in with Apple'}</Text>
          </Button>
        )}

        <Text
          size={16}
          color="gray"
          style={{ marginTop: 32 }}
        >
          {getApplicationId()}
        </Text>
      </Container>
    </>
  );
}
