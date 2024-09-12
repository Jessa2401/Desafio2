import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DatosFinancierosCliente from './src/screens/DatosFinancierosCliente';
import ClasificacionCliente from './src/screens/ClasificacionCliente';

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Datos Financieros" 
          component={DatosFinancierosCliente} 
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FontAwesome5 name="coins" size={24} color={focused ? "#16247d" : "#111"} />
              </View>
            )
          }}
        />
        <Tab.Screen 
          name="Plan" 
          component={ClasificacionCliente} 
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <MaterialCommunityIcons name="finance" size={24} color={focused ? "#16247d" : "#111"} />
              </View>
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}