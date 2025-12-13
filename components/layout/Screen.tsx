import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  topInset?: boolean;
}

export function Screen({ children, style, topInset = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View
      style={[
        styles.screen,
        topInset && { paddingTop: insets.top },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
