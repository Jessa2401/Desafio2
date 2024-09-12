import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons'; // Íconos de Material Design

const EgresoSchema = Yup.object().shape({
  tipoEgreso: Yup.string().required('Requerido'),
  monto: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
});

function Egresos({ route, navigation }) {
  const { ingresos } = route.params;
  const [egresos, setEgresos] = useState([]);
  const [customError, setCustomError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0)); // Para animación de fade in/out

  const handleAddEgreso = (values, { resetForm }) => {
    const newEgreso = { ...values, id: Date.now().toString() };
    setEgresos([...egresos, newEgreso]);

    // Animación de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    resetForm();
    setCustomError('');
  };

  const handleDeleteEgreso = (id) => {
    setEgresos(egresos.filter(egreso => egreso.id !== id));
  };

  const handleEditEgreso = (id, newValues) => {
    setEgresos(egresos.map(egreso => egreso.id === id ? { ...egreso, ...newValues } : egreso));
  };

  const handleNext = () => {
    if (egresos.length === 0) {
      setCustomError('Debe ingresar al menos un tipo de egreso antes de continuar.');
    } else {
      navigation.navigate('Graficas', { ingresos, egresos });
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ tipoEgreso: '', monto: '' }}
        validationSchema={EgresoSchema}
        onSubmit={handleAddEgreso}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Text style={styles.label}>Tipo de Egreso</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values.tipoEgreso}
                onValueChange={handleChange('tipoEgreso')}
                onBlur={handleBlur('tipoEgreso')}
                style={styles.picker}
              >
                <Picker.Item label="Seleccione un tipo de egreso" value="" />
                <Picker.Item label="Alquiler/Hipoteca" value="Alquiler/Hipoteca" />
                <Picker.Item label="Canasta Básica" value="Canasta Básica" />
                <Picker.Item label="Financiamientos" value="Financiamientos" />
                <Picker.Item label="Transporte" value="Transporte" />
                <Picker.Item label="Servicios públicos" value="Servicios públicos" />
                <Picker.Item label="Salud y Seguro" value="Salud y Seguro" />
                <Picker.Item label="Egresos Varios" value="Egresos Varios" />
              </Picker>
            </View>
            {errors.tipoEgreso && touched.tipoEgreso ? <Text style={styles.errorText}>{errors.tipoEgreso}</Text> : null}

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
              <Text style={styles.addButtonText}>Agregar Egreso</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      {customError ? <Text style={styles.errorText}>{customError}</Text> : null}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>

      <FlatList
        data={egresos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View>
              <Text style={styles.cardText}>Tipo de Egreso: {item.tipoEgreso}</Text>
              <Text style={styles.cardText}>Monto: {item.monto}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleDeleteEgreso(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditEgreso(item.id, { tipoEgreso: 'Nuevo Tipo', monto: 'Nuevo Monto' })}>
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

export default Egresos;
