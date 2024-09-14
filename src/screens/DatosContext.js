import React, { createContext, useState } from 'react';


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);

  return (
    <DatosContext.Provider value={{ ingresos, setIngresos, egresos, setEgresos }}>
      {children}
    </DatosContext.Provider>
  );
};