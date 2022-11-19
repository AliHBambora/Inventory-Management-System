import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [customers, setCustomers] = useState([]); 

  return (
    <DataContext.Provider value={{invoices, setInvoices,products,setProducts,customers,setCustomers}}>
      {children}
    </DataContext.Provider>
  );
};