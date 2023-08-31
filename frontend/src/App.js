// import './App.css';
import { useContext, useEffect, useState } from "react";
import { DashboardLayout } from "./Components/dashboard-layout";
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invalid from "./Components/pages/Invalid";
import Customers from "./Components/pages/customers";
import Dashboard from "./Components/pages/dashboard";
import Products from "./Components/pages/products";
import Invoices from "./Components/pages/invoices";
import CreateNewInvoice from "./Components/pages/createNewInvoice";
import { DataContext } from "./Components/Context/DataContext";
import ToastNotification from "./Components/Notifications/ToastNotification";


function App({ children }) {
  const [isLocalStorageEmpty, setIsLocalStorageEmpty] = useState(true);
  const {showToast,toastType,toastMessage} = useContext(DataContext);

  useEffect(() => {
    if (
      localStorage.getItem("token") != null ||
      localStorage.getItem("token") == ""
    ) {
      setIsLocalStorageEmpty(false);
    }
  }, [isLocalStorageEmpty]);

  return isLocalStorageEmpty ? (
    <Login
      setValueOfisLocalStorageEmpty={(value) => setIsLocalStorageEmpty(value)}
    />
  ) : (
    <>
      <DashboardLayout>
        {children}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="createInvoice" element={<CreateNewInvoice />} />
          
          <Route path="*" element={<Invalid />} />
        </Routes>
      </DashboardLayout>
      {/* Toast notification */}
      <ToastNotification show={showToast} toastType={toastType} toastMessage={toastMessage} />
    </>
  );
}

export default App;
