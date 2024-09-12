import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons'; // Para usar íconos

const IngresoSchema = Yup.object().shape({
  tipoIngreso: Yup.string().required('Requerido'),
  monto: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
});

function Ingresos({ navigation }) {
  const [ingresos, setIngresos] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // Para animación de fade in/out

  const handleAddIngreso = (values, { resetForm }) => {
    const newIngreso = { ...values, id: Date.now().toString() };
    setIngresos([...ingresos, newIngreso]);

    // Animación de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    resetForm();
  };

  const handleDeleteIngreso = (id) => {
    setIngresos(ingresos.filter(ingreso => ingreso.id !== id));
  };

  const handleEditIngreso = (id, newValues) => {
    setIngresos(ingresos.map(ingreso => ingreso.id === id ? { ...ingreso, ...newValues } : ingreso));
  };

  const handleNext = () => {
    if (ingresos.length === 0) {
      Alert.alert('Error', 'Debe ingresar al menos un tipo de ingreso antes de continuar.');
    } else {
      navigation.navigate('Egresos', { ingresos });
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ tipoIngreso: '', monto: '' }}
        validationSchema={IngresoSchema}
        onSubmit={handleAddIngreso}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Text style={styles.label}>Tipo de Ingreso</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values.tipoIngreso}
                onValueChange={handleChange('tipoIngreso')}
                onBlur={handleBlur('tipoIngreso')}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un tipo de ingreso" value="" />
                <Picker.Item label="Salario" value="Salario" />
                <Picker.Item label="Negocio Propio" value="Negocio Propio" />
                <Picker.Item label="Pensiones" value="Pensiones" />
                <Picker.Item label="Remesas" value="Remesas" />
                <Picker.Item label="Ingresos Varios" value="Ingresos Varios" />
              </Picker>
            </View>
            {errors.tipoIngreso && touched.tipoIngreso ? <Text style={styles.errorText}>{errors.tipoIngreso}</Text> : null}

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('monto')}
              onBlur={handleBlur('monto')}
              value={values.monto}
              keyboardType="numeric"
              placeholder="Ingrese el monto"
              placeholderTextColor="#aaa"
            />
            {errors.monto && touched.monto ? <Text style={styles.errorText}>{errors.monto}</Text> : null}

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Agregar Ingreso</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>

      <FlatList
        data={ingresos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View>
              <Text style={styles.cardText}>Tipo de Ingreso: {item.tipoIngreso}</Text>
              <Text style={styles.cardText}>Monto: {item.monto}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleDeleteIngreso(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditIngreso(item.id, { tipoIngreso: 'Nuevo Tipo', monto: 'Nuevo Monto' })}>
                <MaterialIcons name="edit" size={24} color="blue" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
  },
});

export default Ingresos;
