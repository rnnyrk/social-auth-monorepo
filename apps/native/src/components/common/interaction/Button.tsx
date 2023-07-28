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
            style={styles(pressed, isDisabled).wrapper}
          >
            <ButtonContent {...buttonContentProps} />
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = (pressed?: boolean, disabled?: boolean) => {
  const customStyles = StyleSheet.create({
    container: {
      height: 48,
      width: 200,
    },
    icon: {
      alignItems: 'center',
      height: 16,
      marginRight: 16,
      width: 16,
    },
    label: {
      fontSize: 16,
    },
    wrapper: {
      alignItems: 'center',
      backgroundColor: pressed || disabled ? '#CCCCCC' : 'white',
      borderColor: '#CCCCCC',
      borderRadius: 8,
      borderWidth: 2,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

  return customStyles;
};
