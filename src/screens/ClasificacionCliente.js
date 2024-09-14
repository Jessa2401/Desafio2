import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ClasificacionCliente() {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [disponibilidadFinanciera, setDisponibilidadFinanciera] = useState(0);
  const [porcentajeDisponibilidad, setPorcentajeDisponibilidad] = useState(0);
  const [clasificacion, setClasificacion] = useState([]);

  const loadData = async () => {
    try {
      const storedIngresos = await AsyncStorage.getItem('@ingresos');
      const storedEgresos = await AsyncStorage.getItem('@egresos');

      const totalIngresos = storedIngresos 
        ? JSON.parse(storedIngresos).reduce((sum, item) => sum + parseFloat(item.monto), 0) 
        : 0;

      const totalEgresos = storedEgresos 
        ? JSON.parse(storedEgresos).reduce((sum, item) => sum + parseFloat(item.monto), 0) 
        : 0;

      setIngresos(totalIngresos);
      setEgresos(totalEgresos);
      const disponibilidad = totalIngresos - totalEgresos;
      setDisponibilidadFinanciera(disponibilidad);
      setPorcentajeDisponibilidad(totalIngresos ? (disponibilidad * 100) / totalIngresos : 0);
    } catch (e) {
      console.error("Error cargando datos financieros", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calcularClasificacion();
  }, [disponibilidadFinanciera, porcentajeDisponibilidad]);

  const calcularClasificacion = () => {
    let planes = [];
    if (ingresos < 360) {
      planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
    } else if (ingresos >= 360 && ingresos < 700) {
      if (porcentajeDisponibilidad < 40) {
        planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
      } else {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Credito personal hasta $ 2,000.00' }
        ];
      }
    } else if (ingresos >= 700 && ingresos < 1200) {
      if (porcentajeDisponibilidad < 20) {
        planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
      } else if (porcentajeDisponibilidad >= 20 && porcentajeDisponibilidad < 40) {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Credito personal hasta $ 2,000.00' }
        ];
      } else {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Credito personal hasta $ 5,000.00' }
        ];
      }
    } else if (ingresos >= 1200) {
      if (porcentajeDisponibilidad < 20) {
        planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
      } else if (porcentajeDisponibilidad >= 20 && porcentajeDisponibilidad <= 30) {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Tarjeta de Credito Platinum' },
          { key: 'Credito personal hasta $ 25,000.00' }
        ];
      } else {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Tarjeta de Credito Platinum' },
          { key: 'Tarjeta de Credito Black' },
          { key: 'Credito personal hasta $ 50,000.00' }
        ];
      }
    }
    setClasificacion(planes);
  };

  return (
    <View style={styles.container}>
      
      <Text></Text>
      <Text style={styles.title}>Informació Crediticia</Text>

      <View style={styles.dataContainer}>
        <Text style={styles.label}>Ingresos totales: ${ingresos}</Text>
        <Text style={styles.label}>Egresos totales: ${egresos}</Text>
        <Text style={styles.label}>Disponibilidad financiera: ${disponibilidadFinanciera}</Text>
        <Text style={styles.label}>Porcentaje de disponibilidad financiera: {porcentajeDisponibilidad}%</Text>
      </View>
      <Text style={styles.title}>Plan Crediticio</Text>
      <FlatList
        data={clasificacion}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  dataContainer: {
    marginBottom: 20,
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    marginVertical: 5,
    color: '#555',
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  item: {
    fontSize: 18,
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    color: '#333',
  },
});