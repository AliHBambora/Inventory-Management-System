import { Box, Container } from '@mui/material';
import axios from 'axios';
import { ProductsListResults } from '../products/product-list-results.js';

// import { customers } from '../__mocks__/customers';
import app_constants from '../../constants/constants';
import Swal from 'sweetalert2';
import { useContext, useEffect, useState } from 'react';
import InvoicesListResults from '../Invoices/InvoicesListResults.js';
import { DataContext } from '../Context/DataContext.js';
import { getAllInvoices } from '../../APIFunctions/GetAllInvoices.js';

const Invoices = () => {
  const {invoices,setInvoices} = useContext(DataContext);

  // useEffect(() => {
  //   getAllInvoices();
  // }, [])

  useEffect(()=>{
    getAllInvoices().then((res)=>{
      if(res.status=="success"){
        setInvoices(res.data);
      }
    });
  },[]);
  
  

  return (
  <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2
      }}
    >
      <Container maxWidth={false}>
        {/* <CustomerListToolbar refreshcustomers={getAllCustomers} customers={customers} setCustomersValue={(value)=>setCustomers(value)}  /> */}
        <Box>
          {/* <ProductsListResults refreshproducts={getAllProducts} products={products} /> */}
          <InvoicesListResults/>
        </Box>
      </Container>
    </Box>
  </>
)};

export default Invoices;
