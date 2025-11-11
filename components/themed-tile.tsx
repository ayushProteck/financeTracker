import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTile({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const tileColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tile');

  return <View style={[{ 
    backgroundColor: tileColor,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    padding: 15,
 }, style]} {...otherProps} />;
}
