import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

const IngresoSchema = Yup.object().shape({
  tipoIngreso: Yup.string().required('Requerido'),
  monto: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
});

function Ingresos({ navigation }) {
  const [ingresos, setIngresos] = useState([]);

  const handleAddIngreso = (values, { resetForm }) => {
    setIngresos([...ingresos, { ...values, id: Date.now().toString() }]);
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
    <View>
      <Formik
        initialValues={{ tipoIngreso: '', monto: '' }}
        validationSchema={IngresoSchema}
        onSubmit={handleAddIngreso}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text>Tipo de Ingreso</Text>
            <Picker
              selectedValue={values.tipoIngreso}
              onValueChange={handleChange('tipoIngreso')}
              onBlur={handleBlur('tipoIngreso')}
            >
              <Picker.Item label="Seleccione un tipo de ingreso" value="" />
              <Picker.Item label="Salario" value="Salario" />
              <Picker.Item label="Negocio Propio" value="Negocio Propio" />
              <Picker.Item label="Pensiones" value="Pensiones" />
              <Picker.Item label="Remesas" value="Remesas" />
              <Picker.Item label="Ingresos Varios" value="Ingresos Varios" />
            </Picker>
            {errors.tipoIngreso && touched.tipoIngreso ? <Text>{errors.tipoIngreso}</Text> : null}

            <Text>Monto</Text>
            <TextInput
              onChangeText={handleChange('monto')}
              onBlur={handleBlur('monto')}
              value={values.monto}
              keyboardType="numeric"
            />
            {errors.monto && touched.monto ? <Text>{errors.monto}</Text> : null}

            <Button onPress={handleSubmit} title="Agregar Ingreso" />
          </View>
        )}
      </Formik>

      <Button
        title="Siguiente"
        onPress={handleNext}
      />
      <FlatList
        data={ingresos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View>
              <Text>Tipo de Ingreso: {item.tipoIngreso}</Text>
              <Text>Monto: {item.monto}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleDeleteIngreso(item.id)}>
                <Text style={{ color: 'red' }}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditIngreso(item.id, { tipoIngreso: 'Nuevo Tipo', monto: 'Nuevo Monto' })}>
                <Text style={{ color: 'blue', marginLeft: 10 }}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

    </View>
  );
}

export default Ingresos;