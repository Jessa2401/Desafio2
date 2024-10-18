import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ProductoFinanciero = ({ route }) => {
  const { productos } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos Financieros</Text>
      <FlatList
        data={productos}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        keyExtractor={(item, index) => index.toString()}
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
  },
  item: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default ProductoFinanciero;