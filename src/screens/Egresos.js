import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EgresoSchema = Yup.object().shape({
  tipoEgreso: Yup.string().required('Requerido'),
  monto: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
});

function Egresos({ route, navigation }) {
  const { ingresos } = route.params;
  const [egresos, setEgresos] = useState([]);
  const [customError, setCustomError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0)); // Para animación de fade in/out
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEgreso, setCurrentEgreso] = useState(null);

  // Función para guardar los egresos en AsyncStorage
  const saveEgresosToStorage = async (egresos) => {
    try {
      await AsyncStorage.setItem('@egresos', JSON.stringify(egresos));
    } catch (error) {
      console.error('Error guardando los egresos:', error);
    }
  };

  // Función para cargar los egresos de AsyncStorage
  const loadEgresosFromStorage = async () => {
    try {
      const storedEgresos = await AsyncStorage.getItem('egresos');
      if (storedEgresos !== null) {
        setEgresos(JSON.parse(storedEgresos));
      }
    } catch (error) {
      console.error('Error cargando los egresos:', error);
    }
  };

  useEffect(() => {
    loadEgresosFromStorage();
  }, []);

  const handleAddEgreso = (values, { resetForm }) => {
    const newEgreso = {
      id: Date.now().toString(),
      tipoEgreso: values.tipoEgreso,
      monto: values.monto,
    };
    const updatedEgresos = egresos.concat(newEgreso); // Usamos concat
    setEgresos(updatedEgresos);

    // Guardar los egresos en AsyncStorage
    saveEgresosToStorage(updatedEgresos);

    // Animación de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    resetForm();
    setCustomError('');
  };

  const handleEditEgreso = (values) => {
    const updatedEgresos = egresos.map(egreso => {
      if (egreso.id === currentEgreso.id) {
        return {
          id: egreso.id,
          tipoEgreso: values.tipoEgreso,
          monto: values.monto,
        };
      }
      return egreso;
    });
    setEgresos(updatedEgresos);

    // Guardar los egresos en AsyncStorage
    saveEgresosToStorage(updatedEgresos);

    setEditModalVisible(false);
  };

  const handleDeleteEgreso = (id) => {
    const updatedEgresos = egresos.filter(egreso => egreso.id !== id);
    setEgresos(updatedEgresos);

    // Guardar los egresos actualizados en AsyncStorage
    saveEgresosToStorage(updatedEgresos);
  };

  const handleNext = () => {
    if (egresos.length === 0) {
      setCustomError('Debe ingresar al menos un tipo de egreso antes de continuar.');
    } else {
      navigation.navigate('Graficas', { ingresos, egresos });
    }
  };

  // Nueva función para abrir el modal de edición
  const openEditModal = (egreso) => {
    setCurrentEgreso(egreso); // Asigna el egreso que se va a editar
    setEditModalVisible(true); // Muestra el modal
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
            <Text style={styles.listText}>Describa todos los egresos que mensuales</Text>
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
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={24} color="blue" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      {/* Modal para editar egreso */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {currentEgreso && (
              <Formik
                initialValues={{ tipoEgreso: currentEgreso.tipoEgreso, monto: currentEgreso.monto }}
                validationSchema={EgresoSchema}
                onSubmit={handleEditEgreso}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
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

                    <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                      <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
  },
  cardActions: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Egresos;
