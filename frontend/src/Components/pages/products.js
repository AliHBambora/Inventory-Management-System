import { Box, CircularProgress, Container } from "@mui/material";
import axios from "axios";
import { ProductsListResults } from "../products/product-list-results.js";

// import { customers } from '../__mocks__/customers';
import app_constants from "../../constants/constants";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { getAllProducts } from "../../APIFunctions/GetAllProducts.js";
import { DataContext } from "../Context/DataContext.js";

const Products = () => {
  const { setProducts } = useContext(DataContext);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    setProductsLoading(true);
    console.log("true");
    getAllProducts().then((res) => {
      setProductsLoading(false);
      if (res.status == "success") {
        setProducts(res.data);
      }
    });
  }, []);

  return (
    <>
      {productsLoading ? (
        <div style={{ display: "grid", placeItems: "center",height:"100vh",width:"100vw" }}>
          <CircularProgress size={50} color="primary" />
        </div>
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 2,
          }}
        >
          <Container maxWidth={false}>
            {/* <CustomerListToolbar refreshcustomers={getAllCustomers} customers={customers} setCustomersValue={(value)=>setCustomers(value)}  /> */}
            <Box>
              <ProductsListResults refreshproducts={getAllProducts} />
            </Box>
          </Container>
        </Box>
      )}
    </>
  );
};

export default Products;
