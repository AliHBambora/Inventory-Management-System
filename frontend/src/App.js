// import './App.css';
import { useEffect, useState } from "react";
import { DashboardLayout } from "./Components/dashboard-layout";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invalid from "./Components/pages/Invalid";
import Customers from "./Components/pages/customers";
import Dashboard from "./Components/pages/dashboard";
import Products from "./Components/pages/products";
import Invoices from "./Components/pages/invoices";
import CreateNewInvoice from "./Components/pages/createNewInvoice";


function App({ children }) {
  const [isSessionStorageEmpty, setIsSessionStorageEmpty] = useState(true);

  useEffect(() => {
    if (
      sessionStorage.getItem("token") != null ||
      sessionStorage.getItem("token") == ""
    ) {
      setIsSessionStorageEmpty(false);
    }
  }, [isSessionStorageEmpty]);

  return isSessionStorageEmpty ? (
    <Login
      setValueOfisLocalStorageEmpty={(value) => setIsSessionStorageEmpty(value)}
    />
  ) : (
    <>
      <DashboardLayout>
        {children}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="createInvoice" element={<CreateNewInvoice />} />
          <Route path="*" element={<Invalid />} />
        </Routes>
      </DashboardLayout>
    </>
  );
}

export default App;
