import { Box, Container } from "@mui/material";
import axios from "axios";
import { ProductsListResults } from "../products/product-list-results.js";

// import { customers } from '../__mocks__/customers';
import app_constants from "../../constants/constants";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { getAllProducts } from "../../API/GetAllProducts.js";
import { DataContext } from "../Context/DataContext.js";

const Products = () => {
  // useEffect(() => {
  //   // console.log(products);
  //   // if(products==null||products.length==0){
  //   //   getAllProducts();
  //   // }
  //   getAllProducts();
  // }, [])
  const { setProducts } = useContext(DataContext);

  useEffect(() => {
    getAllProducts().then((res) => {
      if (res.status == "success") {
        setProducts(res.data);
      }
    });
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
            <ProductsListResults refreshproducts={getAllProducts} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Products;
