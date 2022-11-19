import { Box, Container } from "@mui/material";
import axios from "axios";
import { CustomerListResults } from "../customer/customer-list-results";
import { CustomerListToolbar } from "../customer/customer-list-toolbar";
import { DashboardLayout } from "../dashboard-layout";
// import { customers } from '../__mocks__/customers';
import app_constants from "../../constants/constants";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { getAllCustomers } from "../../APIFunctions/GetAllCustomers";
import { DataContext } from "../Context/DataContext";

const Customers = () => {
  // useEffect(() => {
  //   getAllCustomers();
  // }, [])
  const { customers,setCustomers } = useContext(DataContext);

  useEffect(() => {
    if (customers.length == 0) {
      getAllCustomers().then((res) => {
        if (res.status == "success") {
          console.log(res.data);
          setCustomers(res.data);
        }
      });
    }
  }, []);

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          {/* <CustomerListToolbar refreshcustomers={getAllCustomers} customers={customers} setCustomersValue={(value)=>setCustomers(value)}  /> */}
          <Box>
            <CustomerListResults refreshcustomers={getAllCustomers} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Customers;
