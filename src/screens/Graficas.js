import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { Dimensions } from 'react-native';

function Graficas({ route }) {
  const { ingresos, egresos } = route.params;

  // Calcular el total de ingresos y egresos
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + parseFloat(ingreso.monto), 0);
  const totalEgresos = egresos.reduce((sum, egreso) => sum + parseFloat(egreso.monto), 0);

  // Calcular los porcentajes de cada ingreso
  const ingresosData = ingresos.map(ingreso => ({
    label: ingreso.tipoIngreso,
    value: (parseFloat(ingreso.monto) / totalIngresos) * 100,
  }));

  // Calcular los porcentajes de cada egreso
  const egresosData = egresos.map(egreso => ({
    label: egreso.tipoEgreso,
    value: (parseFloat(egreso.monto) / totalEgresos) * 100,
  }));

  // Configurar los datos del gráfico de ingresos
  const ingresosSeries = ingresosData.map(data => data.value);
  const ingresosSliceColor = ingresosData.map((_, index) => `hsl(${index * 360 / ingresosData.length}, 70%, 50%)`);

  // Configurar los datos del gráfico de egresos
  const egresosSeries = egresosData.map(data => data.value);
  const egresosSliceColor = egresosData.map((_, index) => `hsl(${index * 360 / egresosData.length}, 70%, 50%)`);

  // Configurar los datos para la gráfica comparativa de Ingresos vs Egresos
  const comparativaSeries = [totalIngresos, totalEgresos];
  const comparativaSliceColor = ['#4CAF50', '#F44336']; // Verde para ingresos, rojo para egresos

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Ingresos</Text>
        <PieChart
          widthAndHeight={250} // Tamaño del gráfico
          series={ingresosSeries} // Proporciones
          sliceColor={ingresosSliceColor} // Colores para las porciones
        />
        <Text style={{ fontSize: 16, marginTop: 10 }}>Total Ingresos: ${totalIngresos.toFixed(2)}</Text>
        <View style={{ marginTop: 20 }}>
          {ingresosData.map((data, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <View style={{ width: 20, height: 20, backgroundColor: ingresosSliceColor[index], marginRight: 10 }} />
              <Text>{data.label}: {data.value.toFixed(2)}%</Text>
            </View>
            
          ))}
        </View>

        <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 40 }}>Egresos</Text>
        <PieChart
          widthAndHeight={250} // Tamaño del gráfico
          series={egresosSeries} // Proporciones
          sliceColor={egresosSliceColor} // Colores para las porciones
        />
        
        <Text style={{ fontSize: 16, marginTop: 10 }}>Total Egresos: ${totalEgresos.toFixed(2)}</Text>
        <View style={{ marginTop: 20 }}>
          {egresosData.map((data, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <View style={{ width: 20, height: 20, backgroundColor: egresosSliceColor[index], marginRight: 10 }} />
              <Text>{data.label}: {data.value.toFixed(2)}%</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 40 }}>Ingresos vs Egresos</Text>
        <PieChart
          widthAndHeight={250} // Tamaño del gráfico
          series={comparativaSeries} // Proporciones
          sliceColor={comparativaSliceColor} // Colores para las porciones
        />
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <View style={{ width: 20, height: 20, backgroundColor: comparativaSliceColor[0], marginRight: 10 }} />
            <Text>Ingresos: {(totalIngresos / (totalIngresos + totalEgresos) * 100).toFixed(2)}%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <View style={{ width: 20, height: 20, backgroundColor: comparativaSliceColor[1], marginRight: 10 }} />
            <Text>Egresos: {(totalEgresos / (totalIngresos + totalEgresos) * 100).toFixed(2)}%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default Graficas;