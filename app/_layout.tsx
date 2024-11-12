import '../global.css';
import React from 'react';
import { Stack } from 'expo-router'; 
import { Provider as AuthProvider } from '../hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { Drawer } from 'expo-router/drawer';
import { HeaderButton } from '../components/HeaderButton';


export const unstable_settings = {
  initialRouteName: '(auth)/loading', 
};

export default function RootLayout() {
  return (
    <AuthProvider> 
      <GestureHandlerRootView style={{ flex: 1 }}> 
        <Stack>
          <Stack.Screen name="(auth)/loading" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign_in" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign_up" options={{ headerShown: false }} />
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} /> 
          <Stack.Screen name="(driver)" options={{ headerShown: false }} />
          <Stack.Screen name="(driver)/driverregister.jsx" options={{ headerShown: false }} />         
        </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}



