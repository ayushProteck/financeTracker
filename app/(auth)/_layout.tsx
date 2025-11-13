import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AppAlert from '@/components/ui/appAlert';
import AppConfirm from '@/components/ui/appConfirm';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Provider } from 'jotai';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>  
      <AppAlert />
      <AppConfirm />
    </Provider>
  );
}
