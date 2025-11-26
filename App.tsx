import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AIChatScreen from './src/screens/AIChatScreen';
import SMSParserScreen from './src/screens/SMSParserScreen';

// Import theme
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            cardStyle: { backgroundColor: colors.background },
          }}
        >
          {!isLoggedIn ? (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  animationEnabled: false,
                }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  animationEnabled: true,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="MainApp"
                component={BottomTabNavigator}
                options={{
                  animationEnabled: false,
                }}
              />
              <Stack.Screen
                name="AIChat"
                component={AIChatScreen}
                options={{
                  animationEnabled: true,
                }}
              />
              <Stack.Screen
                name="SMSParser"
                component={SMSParserScreen}
                options={{
                  animationEnabled: true,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
