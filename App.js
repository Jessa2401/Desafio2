import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import DatosFinancierosCliente from './src/screens/DatosFinancierosCliente';
import ClasificacionCliente from './src/screens/ClasificacionCliente';
import { View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#F0F0F0",
    elevation: 0,
    height: 60
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator sreenOptions={screenOptions}>
        <Tab.Screen name="Datos Financieros" 
        component={DatosFinancierosCliente} 
        options={{
          tabBarIcon: ({focused})=>{
            return(
              <View style={{alignItems: "center", justifyContent: "center"}}>
              <FontAwesome5 name="coins" size={24} color={focused ? "#16247d": "#111"} />
            </View>
            )            
          }
        }}
        />
        <Tab.Screen name="Plan" 
        component={ClasificacionCliente} 
        options={{
          tabBarIcon: ({focused})=>{
            return(
              <View style={{alignItems: "center", justifyContent: "center"}}>
                <MaterialCommunityIcons name="finance" size={24} color={focused ? "#16247d": "#111"} />            
              </View>
            )            
          }
        }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}