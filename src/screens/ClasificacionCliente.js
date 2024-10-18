import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ClasificacionCliente() {
  const navigation = useNavigation();
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [disponibilidadFinanciera, setDisponibilidadFinanciera] = useState(0);
  const [porcentajeDisponibilidad, setPorcentajeDisponibilidad] = useState(0);
  const [clasificacion, setClasificacion] = useState([]);

  const handlePress = () => {
    navigation.navigate('ProductoFinanciero', { productos: clasificacion });
  };

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

      const porcentaje = totalIngresos ? (disponibilidad * 100) / totalIngresos : 0;
      setPorcentajeDisponibilidad(porcentaje);

      calcularClasificacion(totalIngresos, totalEgresos, disponibilidad, porcentaje);
    } catch (e) {
      console.error("Error cargando datos financieros", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const calcularClasificacion = (totalIngresos, totalEgresos, disponibilidad, porcentaje) => {
    let planes = [];
    if (totalIngresos < 360) {
      planes = [{ key: 'Apertura de cuenta corriente', icon: 'bank' }];
    } else if (totalIngresos >= 360 && totalIngresos < 700) {
      if (porcentaje < 40) {
        planes = [{ key: 'Apertura de cuenta corriente', icon: 'bank' }];
      } else {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Crédito personal hasta $2,000.00', icon: 'money-bill-wave' },
        ];
      }
    } else if (totalIngresos >= 700 && totalIngresos < 1200) {
      if (porcentaje < 20) {
        planes = [{ key: 'Apertura de cuenta corriente', icon: 'bank' }];
      } else if (porcentaje >= 20 && porcentaje < 40) {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Crédito personal hasta $2,000.00', icon: 'money-bill-wave' },
        ];
      } else {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Oro', icon: 'credit-card' },
          { key: 'Crédito personal hasta $8,000.00', icon: 'money-bill-wave' },
        ];
      }
    } else if (totalIngresos >= 1200 && totalIngresos < 3000) {
      if (porcentaje < 20) {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Crédito personal hasta $2,000.00', icon: 'money-bill-wave' },
        ];
      } else if (porcentaje >= 20 && porcentaje <= 40) {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Oro', icon: 'credit-card' },
          { key: 'Crédito personal hasta $8,000.00', icon: 'money-bill-wave' },
        ];
      } else {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Oro', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Platinum', icon: 'credit-card' },
          { key: 'Crédito personal hasta $25,000.00', icon: 'money-bill-wave' },
        ];
      }
    } else if (totalIngresos >= 3000) {
      if (porcentaje < 20) {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Oro', icon: 'credit-card' },
          { key: 'Crédito personal hasta $8,000.00', icon: 'money-bill-wave' },
        ];
      } else if (porcentaje > 20 && porcentaje < 30) {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Oro', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Platinum', icon: 'credit-card' },
          { key: 'Crédito personal hasta $25,000.00', icon: 'money-bill-wave' },
        ];
      } else {
        planes = [
          { key: 'Apertura de cuenta corriente', icon: 'bank' },
          { key: 'Tarjeta de Crédito Clásica', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Oro', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Platinum', icon: 'credit-card' },
          { key: 'Tarjeta de Crédito Black', icon: 'credit-card' },
          { key: 'Crédito personal hasta $50,000.00', icon: 'money-bill-wave' },
        ];
      }
    }
    setClasificacion(planes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información Crediticia</Text>

      <View style={styles.dataContainer}>
        <Text style={styles.label}>Ingresos totales: ${ingresos}</Text>
        <Text style={styles.label}>Egresos totales: ${egresos}</Text>
        <Text style={styles.label}>Disponibilidad financiera: ${disponibilidadFinanciera}</Text>
        <Text style={styles.label}>Porcentaje de disponibilidad financiera: {porcentajeDisponibilidad.toFixed(2)}%</Text>
      </View>

      <Text style={styles.title}>Plan Crediticio</Text>
      <FlatList
        data={clasificacion}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Icon name={item.icon} size={24} color="#4a90e2" />
            <Text style={styles.item}>{item.key}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      <Button title="Ver Productos Financieros" onPress={handlePress} color="#4a90e2" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  dataContainer: {
    marginBottom: 20,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  item: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  list: {
    width: '100%',
  },
});
