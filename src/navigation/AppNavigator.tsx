import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Timer from '../components/Timer';
import TimeControl from '../components/TimeControl';
import Settings from '../components/Settings';
import Stats from '../components/Stats';

export type RootStackParamList = {
  Timer: undefined;
  TimeControl: undefined;
  Settings: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Timer"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        <Stack.Screen 
          name="Timer" 
          component={Timer}
          options={{
            title: 'Chess Timer',
          }}
        />
        <Stack.Screen 
          name="TimeControl" 
          component={TimeControl}
          options={{
            title: 'Time Control',
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={Settings}
          options={{
            title: 'Settings',
          }}
        />
        <Stack.Screen 
          name="Stats" 
          component={Stats}
          options={{
            title: 'Statistics',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 