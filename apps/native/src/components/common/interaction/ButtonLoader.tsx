import { StyleSheet, View } from 'react-native';

import { ButtonLoaderDot } from './ButtonLoaderDot';

export const ButtonLoader: React.FC = () => {
  return (
    <View style={styles.container}>
      <ButtonLoaderDot delay={0} />
      <ButtonLoaderDot delay={220} />
      <ButtonLoaderDot delay={440} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
