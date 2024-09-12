import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';

function Graficas({ route }) {
  const { ingresos, egresos } = route.params;

  // Calcular el total de ingresos
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.monto), 0);

  // Calcular el total de egresos
  const totalEgresos = egresos.reduce((sum, egreso) => sum + parseFloat(egreso.monto), 0);

  // Total global (ingresos + egresos)
  const total = totalIngresos + totalEgresos;

  // Configurar datos del gráfico de velocímetro
  const data = [totalIngresos, totalEgresos];
  const sliceColor = ['#00e676', '#ff5252']; // Verde para ingresos, rojo para egresos

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Ingresos vs Egresos</Text>

      <PieChart
        widthAndHeight={250} // Tamaño del gráfico
        series={data}        // Proporciones
        sliceColor={sliceColor}  // Colores para las porciones
        coverRadius={0.75}       // Radio interno, ajusta para simular un velocímetro
        coverFill={'#FFF'}       // Color de fondo en el centro del gráfico
      />

      <View style={{ marginTop: 20 }}>
        <Text>Total Ingresos: ${totalIngresos.toFixed(2)}</Text>
        <Text>Total Egresos: ${totalEgresos.toFixed(2)}</Text>
      </View>
    </View>
  );
}

export default Graficas;
