import { PressableProps } from 'react-native';

export type ButtonType = {
  children?: React.ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
};

export type ButtonProps = Omit<PressableProps, 'onPress' | 'style'> &
  ButtonType & {
    isPressed?: boolean;
    onPress: () => void;
    style?: any;
  };

export type ButtonWrapperProps = Pick<ButtonProps, 'isPressed'> &
  Pick<ButtonType, 'isDisabled' | 'icon'>;

export type ButtonContentProps = Pick<ButtonType, 'children' | 'isLoading' | 'icon'>;
