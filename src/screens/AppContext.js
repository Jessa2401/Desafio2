import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);

  useEffect(() => {
    // Recuperar datos de AsyncStorage cuando el componente se monta
    const loadData = async () => {
      try {
        const storedIngresos = await AsyncStorage.getItem('ingresos');
        const storedEgresos = await AsyncStorage.getItem('egresos');
        if (storedIngresos !== null) setIngresos(parseFloat(storedIngresos));
        if (storedEgresos !== null) setEgresos(parseFloat(storedEgresos));
      } catch (error) {
        console.error("Error al recuperar datos de AsyncStorage", error);
      }
    };
    loadData();
  }, []);

  const saveData = async (newIngresos, newEgresos) => {
    try {
      await AsyncStorage.setItem('ingresos', newIngresos.toString());
      await AsyncStorage.setItem('egresos', newEgresos.toString());
      setIngresos(newIngresos);
      setEgresos(newEgresos);
    } catch (error) {
      console.error("Error al guardar datos en AsyncStorage", error);
    }
  };

  return (
    <AppContext.Provider value={{ ingresos, setIngresos: saveData, egresos, setEgresos: saveData }}>
      {children}
    </AppContext.Provider>
  );
};
