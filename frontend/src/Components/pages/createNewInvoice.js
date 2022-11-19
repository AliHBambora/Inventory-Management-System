import { Box, Container } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import Swal from 'sweetalert2';
import app_constants from '../../constants/constants';
import { DataContext } from '../Context/DataContext';
import NewInvoice from '../Invoices/NewInvoice';


const CreateNewInvoice = () => {
  const {products,setProducts} = useContext(DataContext);

  // useEffect(() => {
  //   console.log(products);
  //   if(products==null||products.length==0){
  //     getAllProducts();
  //   }
  // }, [])
  return (
    <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Box>
            <NewInvoice />
        </Box>
      </Container>
    </Box>
  </>
  )
}

export default CreateNewInvoice;