import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';

function calcularCalificacion({ingresos, disponibilidad}) {
  if (ingresos < 360) {
    return {
      calificacion: 'Riesgo muy alta',
      recomendaciones: ['Financiamiento consolidación de deudas', 'Contacto con asesor financiero']
    };
  } else if (ingresos >= 360 && ingresos < 700) {
    if (disponibilidad < 0.4) {
      return {
        calificacion: 'Riesgo Alta',
        recomendaciones: ['Apertura de cuenta']
      };
    } else {
      return {
        calificacion: 'Riesgo Suficiente',
        recomendaciones: ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $2,000.00']
      };
    }
  } else if (ingresos >= 700 && ingresos < 1200) {
    if (disponibilidad < 0.2) {
      return {
        calificacion: 'Riesgo Alta',
        recomendaciones: ['Productos de ese rango']
      };
    } else if (disponibilidad >= 0.2 && disponibilidad <= 0.4) {
      return {
        calificacion: 'Riesgo Suficiente',
        recomendaciones: ['Productos de ese rango']
      };
    } else {
      return {
        calificacion: 'Riesgo Buena',
        recomendaciones: ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Crédito personal hasta $8,000.00']
      };
    }
  } else if (ingresos >= 1200 && ingresos < 3000) {
    if (disponibilidad < 0.2) {
      return {
        calificacion: 'Riesgo Suficiente',
        recomendaciones: ['Productos de ese rango']
      };
    } else if (disponibilidad >= 0.2 && disponibilidad <= 0.4) {
      return {
        calificacion: 'Riesgo Buena',
        recomendaciones: ['Productos de ese rango']
      };
    } else {
      return {
        calificacion: 'Riesgo Muy Buena',
        recomendaciones: ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Tarjeta de crédito Platinum', 'Crédito personal hasta $25,000.00']
      };
    }
  } else if (ingresos >= 3000) {
    if (disponibilidad < 0.2) {
      return {
        calificacion: 'Riesgo Buena',
        recomendaciones: ['Productos de ese rango']
      };
    } else if (disponibilidad >= 0.2 && disponibilidad < 0.3) {
      return {
        calificacion: 'Riesgo Muy Buena',
        recomendaciones: ['Productos de ese rango']
      };
    } else {
      return {
        calificacion: 'Riesgo Excelente',
        recomendaciones: ['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Tarjeta de crédito Platinum', 'Tarjeta de crédito Black', 'Crédito personal hasta $50,000.00']
      };
    }
  }
}

export default function ClasificacionCliente() {
  const [ingresos, setIngresos] = useState(0);
  const [disponibilidad, setDisponibilidad] = useState(0);
  const [resultado, setResultado] = useState(null);

  const handleCalcular = () => {
    const res = calcularCalificacion(ingresos, disponibilidad);
    setResultado(res);
  };

  return (
    <View style={styles.container}>
      <Text>Ingresos: {ingresos}</Text>
      <Text>Disponibilidad: {disponibilidad}</Text>
      <Button title="Calcular Calificación" onPress={handleCalcular} />
      {resultado && (
        <View>
          <Text>Calificación: {resultado.calificacion}</Text>
          <Text>Recomendaciones:</Text>
          {resultado.recomendaciones.map((rec, index) => (
            <Text key={index}>{rec}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});