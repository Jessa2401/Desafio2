import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

const EgresoSchema = Yup.object().shape({
  tipoEgreso: Yup.string().required('Requerido'),
  monto: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
});

function Egresos({ route, navigation }) {
  const { ingresos } = route.params;
  const [egresos, setEgresos] = useState([]);
  const [customError, setCustomError] = useState('');

  const handleAddEgreso = (values, { resetForm }) => {
    setEgresos([...egresos, { ...values, id: Date.now().toString() }]);
    resetForm();
    setCustomError(''); // Clear custom error when an egreso is added
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
    <View>
      <Formik
        initialValues={{ tipoEgreso: '', monto: '' }}
        validationSchema={EgresoSchema}
        onSubmit={handleAddEgreso}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <Text>Tipo de Egreso</Text>
            <Picker
              selectedValue={values.tipoEgreso}
              onValueChange={handleChange('tipoEgreso')}
              onBlur={handleBlur('tipoEgreso')}
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
            {errors.tipoEgreso && touched.tipoEgreso ? <Text>{errors.tipoEgreso}</Text> : null}

            <Text>Monto</Text>
            <TextInput
              onChangeText={handleChange('monto')}
              onBlur={handleBlur('monto')}
              value={values.monto}
              keyboardType="numeric"
              placeholder="Ingrese el monto"
            />
            {errors.monto && touched.monto ? <Text>{errors.monto}</Text> : null}

            <Button onPress={handleSubmit} title="Agregar Egreso" />
          </View>
        )}
      </Formik>

      {customError ? <Text style={{ color: 'red' }}>{customError}</Text> : null}


      <Button
        title="Siguiente"
        onPress={handleNext}
      />

      <FlatList
        data={egresos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View>
              <Text>Tipo de Egreso: {item.tipoEgreso}</Text>
              <Text>Monto: {item.monto}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleDeleteEgreso(item.id)}>
                <Text style={{ color: 'red' }}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEditEgreso(item.id, { tipoEgreso: 'Nuevo Tipo', monto: 'Nuevo Monto' })}>
                <Text style={{ color: 'blue', marginLeft: 10 }}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

    </View>
  );
}

export default Egresos;