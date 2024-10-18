import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';

const ProductoFinanciero = ({ route }) => {
  const { productos } = route.params;
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleProductoSelect = (producto) => {
    // Si el producto ya está seleccionado, lo quitamos de la lista. Si no, lo añadimos.
    if (selectedProductos.includes(producto)) {
      setSelectedProductos(selectedProductos.filter((item) => item !== producto));
    } else {
      setSelectedProductos([...selectedProductos, producto]);
    }
  };

  const validarFormulario = () => {
    if (!nombreCompleto.trim()) {
      Alert.alert("Error", "Por favor, ingresa tu nombre completo.");
      return false;
    }
    if (!direccion.trim()) {
      Alert.alert("Error", "Por favor, ingresa tu dirección.");
      return false;
    }
    if (!telefono.trim()) {
      Alert.alert("Error", "Por favor, ingresa tu número de teléfono.");
      return false;
    }
    if (!/^\d+$/.test(telefono)) {
      Alert.alert("Error", "El teléfono solo debe contener números.");
      return false;
    }
    if (selectedProductos.length === 0) {
      Alert.alert("Error", "Por favor, selecciona al menos un producto financiero.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validarFormulario()) {
      Alert.alert('Solicitud enviada', 'Tu solicitud ha sido enviada con éxito.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Financieros</Text>

      {/* Mostrar los productos seleccionados */}
      {selectedProductos.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedProductoTitle}>Productos seleccionados:</Text>
          {selectedProductos.map((producto, index) => (
            <Text key={index} style={styles.selectedProductoItem}>
              {producto.key}
            </Text>
          ))}
        </View>
      )}

      {/* Formulario */}
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      {/* Botón para enviar la solicitud */}
      <Button title="Enviar Solicitud" onPress={handleSubmit} />

      {/* Lista de productos financieros */}
      <FlatList
        data={productos}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProductoSelect(item)}>
            <Text
              style={[
                styles.item,
                selectedProductos.includes(item) ? styles.selectedItem : null,
              ]}
            >
              {item.key}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    fontSize: 18,
    color: '#444',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#d0f0c0', // Color diferente para productos seleccionados
  },
  selectedContainer: {
    marginBottom: 20,
  },
  selectedProductoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedProductoItem: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default ProductoFinanciero;
