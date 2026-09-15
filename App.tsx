import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CompareScreen from './src/screens/CompareScreen';
import CompareResultScreen from './src/screens/CompareResultScreen';
import PredictionsScreen from './src/screens/PredictionsScreen';
import PredictionDetailScreen from './src/screens/PredictionDetailScreen';
import { useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { token } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Compare" component={CompareScreen} />
          <Stack.Screen name="CompareResult" component={CompareResultScreen} />
          <Stack.Screen name="Predictions" component={PredictionsScreen} />
          <Stack.Screen name="PredictionDetail" component={PredictionDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
