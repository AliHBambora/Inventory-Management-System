import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  return (
    <DataContext.Provider
      value={{
        invoices,
        setInvoices,
        products,
        setProducts,
        customers,
        setCustomers,
        showToast,
        setShowToast,
        toastType,
        setToastType,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
