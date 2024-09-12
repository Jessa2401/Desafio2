import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons'; // Importa los iconos que necesitas

const IngresoSchema = Yup.object().shape({
  tipoIngreso: Yup.string().required('Requerido'),
  monto: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
});

function Ingresos({ navigation }) {
  const [ingresos, setIngresos] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentIngreso, setCurrentIngreso] = useState(null);

  const handleAddIngreso = (values, { resetForm }) => {
    setIngresos([...ingresos, { ...values, id: Date.now().toString() }]);
    resetForm();
  };

  const handleDeleteIngreso = (id) => {
    setIngresos(ingresos.filter(ingreso => ingreso.id !== id));
  };

  const handleEditIngreso = (values) => {
    setIngresos(ingresos.map(ingreso =>
      ingreso.id === currentIngreso.id ? { ...ingreso, ...values } : ingreso
    ));
    setModalVisible(false); // Cierra el modal al terminar la edición
  };

  const openEditModal = (ingreso) => {
    setCurrentIngreso(ingreso);
    setModalVisible(true);
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
            {errors.tipoIngreso && touched.tipoIngreso ? <Text style={styles.error}>{errors.tipoIngreso}</Text> : null}

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('monto')}
              onBlur={handleBlur('monto')}
              value={values.monto}
              keyboardType="numeric"
              placeholder="Ingrese el monto"
            />
            {errors.monto && touched.monto ? <Text style={styles.error}>{errors.monto}</Text> : null}

            <Button onPress={handleSubmit} title="Agregar Ingreso" color="#4CAF50" />
          </View>
        )}
      </Formik>

      <Button
        title="Siguiente"
        onPress={handleNext}
        color="#2196F3"
        style={styles.nextButton}
      />

      <FlatList
        data={ingresos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.listText}>Tipo de Ingreso: {item.tipoIngreso}</Text>
              <Text style={styles.listText}>Monto: {item.monto}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDeleteIngreso(item.id)} style={styles.actionButton}>
                <Ionicons name="trash-bin" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                <Ionicons name="pencil" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal para editar ingreso */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {currentIngreso && (
              <Formik
                initialValues={{ tipoIngreso: currentIngreso.tipoIngreso, monto: currentIngreso.monto }}
                validationSchema={IngresoSchema}
                onSubmit={handleEditIngreso}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View>
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
                    {errors.tipoIngreso && touched.tipoIngreso ? <Text style={styles.error}>{errors.tipoIngreso}</Text> : null}

                    <Text style={styles.label}>Monto</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange('monto')}
                      onBlur={handleBlur('monto')}
                      value={values.monto}
                      keyboardType="numeric"
                    />
                    {errors.monto && touched.monto ? <Text style={styles.error}>{errors.monto}</Text> : null}

                    <Button onPress={handleSubmit} title="Guardar Cambios" color="#4CAF50" />
                  </View>
                )}
              </Formik>
            )}
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#F44336" />
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
    backgroundColor: '#f5f5f5',
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  nextButton: {
    marginTop: 10,
  },
  listItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  listText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 10,
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
});

export default Ingresos;
