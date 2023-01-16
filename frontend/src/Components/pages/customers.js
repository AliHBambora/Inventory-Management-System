import { Box, Container } from "@mui/material";
import axios from "axios";
import { CustomerListResults } from "../customer/customer-list-results";
import { CustomerListToolbar } from "../customer/customer-list-toolbar";
import { DashboardLayout } from "../dashboard-layout";
// import { customers } from '../__mocks__/customers';
import { useContext, useEffect, useState } from "react";
import { getAllCustomers } from "../../API/GetAllCustomers";
import { DataContext } from "../Context/DataContext";

const Customers = () => {
  const { customers,setCustomers } = useContext(DataContext);

  useEffect(() => {
    if (customers.length == 0) {
      getAllCustomers().then((res) => {
        if (res.status == "success") {
          setCustomers(res.data);
        }
      });
    }
  }, [customers]);

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
          <Box>
            <CustomerListResults refreshcustomers={getAllCustomers} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Customers;
