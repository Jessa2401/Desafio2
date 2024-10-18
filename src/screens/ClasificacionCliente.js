import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Importar hook de navegación

export default function ClasificacionCliente() {
  const navigation = useNavigation(); // Obtener la navegación
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

      const porcentaje = totalIngresos ? (disponibilidad * 100) / totalIngresos : 0;
      setPorcentajeDisponibilidad(porcentaje);

      // Calcular la clasificación después de que los datos se han actualizado
      calcularClasificacion(totalIngresos, totalEgresos, disponibilidad, porcentaje);
    } catch (e) {
      console.error("Error cargando datos financieros", e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();  // Recarga los datos cuando la pantalla recibe el foco
    });

    return unsubscribe;  // Limpia el listener cuando el componente se desmonta
  }, [navigation]);

  const calcularClasificacion = (totalIngresos, totalEgresos, disponibilidad, porcentaje) => {
    let planes = [];
    if (totalIngresos < 360) {
      planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
    } else if (totalIngresos >= 360 && totalIngresos < 700) {
      if (porcentaje < 40) {
        planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
      } else {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Credito personal hasta $ 2,000.00' }
        ];
      }
    } else if (totalIngresos >= 700 && totalIngresos < 1200) {
      if (porcentaje < 20) {
        planes = [{ key: 'Tiene acceso a apertura de cuenta corriente' }];
      } else if (porcentaje >= 20 && porcentaje < 40) {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Credito personal hasta $ 2,000.00' }
        ];
      } else {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clásica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Credito personal hasta $ 8,000.00' }
        ];
      }
    } else if (totalIngresos >= 1200 && totalIngresos < 3000) {
      if (porcentaje < 20) {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Credito personal hasta $ 2,000.00' }
        ];
      } else if (porcentaje >= 20 && porcentaje <= 40) {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clásica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Credito personal hasta $ 8,000.00' }
        ];
      } else {
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Tarjeta de Credito Platinum' },
          { key: 'Credito personal hasta $ 25,000.00' }
        ];
      }
    } else if(totalIngresos >= 3000) {
      if(porcentaje < 20){
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clásica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Credito personal hasta $ 8,000.00' }
        ];
      } else if(porcentaje >20 && porcentaje < 30){
        planes = [
          { key: 'Tiene acceso a apertura de cuenta corriente' },
          { key: 'Tarjeta de Credito Clasica' },
          { key: 'Tarjeta de Credito Oro' },
          { key: 'Tarjeta de Credito Platinum' },
          { key: 'Credito personal hasta $ 25,000.00' }
        ];
      } else{
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
      <Text style={styles.title}>Información Crediticia</Text>

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
