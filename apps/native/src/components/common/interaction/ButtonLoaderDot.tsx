import { Animated, Easing, StyleSheet } from 'react-native';

export const ButtonLoaderDot = ({ delay }: ButtonLoaderDotProps) => {
  const opacityValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(opacityValue, {
      toValue: 100,
      duration: 1400,
      delay: delay,
      easing: Easing.ease,
      useNativeDriver: true,
    }),
  ).start();

  const opacity = opacityValue.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0.0, 1.0, 0.0],
  });

  return <Animated.View style={{ ...styles.dot, opacity }} />;
};

type ButtonLoaderDotProps = {
  delay: number;
};

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginRight: 3,
    backgroundColor: '#FFFFFF',
  },
});
