import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

function Graficas({ route }) {
  const { ingresos, egresos } = route.params;

  // Calcular el total de ingresos
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.monto), 0);

  // Calcular el total de egresos
  const totalEgresos = egresos.reduce((sum, egreso) => sum + parseFloat(egreso.monto), 0);

  // Datos para el gráfico de barras
  const data = {
    labels: ['Ingresos', 'Egresos'],
    datasets: [
      {
        data: [totalIngresos, totalEgresos]
      }
    ]
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Ingresos vs Egresos</Text>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          }
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
}

export default Graficas;