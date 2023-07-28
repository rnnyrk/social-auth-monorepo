import { useNavigation } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Menu } from '@common/svg';

export const LogoHeader = ({ showDrawer = false }: LogoHeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles(insets.top).container}>
      <View />
      <Text>Expo Router + Supabase Auth</Text>
      {showDrawer ? (
        <Pressable
          hitSlop={10}
          onPress={() => (navigation as any)?.toggleDrawer()}
        >
          {({ pressed }) => <Menu fill={pressed ? '#61C4E3' : '#A6DEEF'} />}
        </Pressable>
      ) : (
        <View />
      )}
    </View>
  );
};

type LogoHeaderProps = {
  showDrawer?: boolean;
};

const styles = (paddingTop: number) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop,
      position: 'relative',
      width: '100%',
    },
  });
