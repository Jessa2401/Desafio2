import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';


const ProductoFinanciero = ({ route }) => {



  const { productos } = route.params;
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fotografiaCarnet, setFotografiaCarnet] = useState(null); // Guardará la URI de la foto del carnet
  const [fotografiaSelfie, setFotografiaSelfie] = useState(null); 
  
  

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la cámara.');
      }
    })();
  }, []);

  

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

  const handleSubmit = async () => {
    if (validarFormulario()) {
      const data = {
        nombreCompleto: nombreCompleto,
        informacionDireccion: direccion,
        telefono: telefono,
        productos: selectedProductos.map(producto => producto.key), // Solo envía los nombres de productos
        idPaquete: 1, // Puedes actualizar esto según lo que corresponda
        salario: 1500.00, // Deberías actualizar estos valores dinámicamente si tienes esa información
        negocioPropio: 500.00,
        pensiones: 200.00,
        remesas: 300.00,
        ingresosVarios: 100.00,
        alquilerHipoteca: 400.00,
        canastaBasica: 200.00,
        financiamientos: 100.00,
        transporte: 150.00,
        serviciosPublicos: 80.00,
        saludSeguro: 120.00,
        egresosVarios: 50.00
      };
  
      try {
        const response = await axios.post('https://bancoudb.onrender.com/api/clientes/save', data);
  
        if (response.status === 200) {
          Alert.alert('Solicitud enviada', 'Tu solicitud ha sido enviada con éxito.');
        } else {
          Alert.alert('Error', 'Hubo un problema al enviar la solicitud.');
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        Alert.alert('Error', 'No se pudo enviar la solicitud.');
      }
    }
  };
  
  const pickImage = async (setImage) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Financieros</Text>

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

<TouchableOpacity style={styles.photoButton} onPress={() => pickImage(setFotografiaCarnet)}>
        <Text style={styles.photoButtonText}>Tomar foto de Carnet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(setFotografiaSelfie)}>
        <Text style={styles.photoButtonText}>Tomar Selfie</Text>
      </TouchableOpacity>
      {/* Botón para enviar la solicitud */}
      <Button title="Enviar Solicitud" onPress={handleSubmit} />
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
  photoButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default ProductoFinanciero;
