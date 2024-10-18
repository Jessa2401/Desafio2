import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import Ingresos from './Ingresos';
import Egresos from './Egresos';
import Graficas from './Graficas';
import ProductoFinanciero from './ProductoFinanciero';


const Stack = createStackNavigator();

function DatosFinancierosCliente() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Ingresos" component={Ingresos} />
            <Stack.Screen name="Egresos" component={Egresos} />
            <Stack.Screen name="Graficas" component={Graficas} />
            <Stack.Screen name="ProductoFinanciero" component={ProductoFinanciero} />
        </Stack.Navigator>
    );
}

export default DatosFinancierosCliente;