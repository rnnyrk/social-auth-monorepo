import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ButtonLoader } from './ButtonLoader';
import { ButtonContentProps, ButtonProps } from './types';

const ButtonContent = ({ children, icon, isLoading }: ButtonContentProps) => (
  <>
    {isLoading ? (
      <ButtonLoader />
    ) : (
      <>
        {icon && <View style={styles().icon}>{icon}</View>}
        <Text style={styles().label}>{children}</Text>
      </>
    )}
  </>
);

export const Button = ({ children, icon, isLoading, isDisabled, onPress, style }: ButtonProps) => {
  const styledButtonProps = {
    isDisabled,
    isLoading,
  };

  const buttonContentProps = {
    children,
    icon,
    isLoading,
  };

  return (
    <Pressable
      onPress={onPress}
      style={{ ...styles().container, ...style }}
    >
      {({ pressed }) => {
        return (
          <View
            {...styledButtonProps}
            style={styles(pressed).wrapper}
          >
            <ButtonContent {...buttonContentProps} />
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = (pressed?: boolean) =>
  StyleSheet.create({
    container: {
      width: 200,
      height: 48,
    },
    wrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#CCCCCC',
      backgroundColor: pressed ? '#CCCCCC' : 'white',
    },
    icon: {
      width: 16,
      height: 16,
      marginRight: 16,
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
    },
  });
