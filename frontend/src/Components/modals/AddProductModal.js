import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/customer-list-results.module.css";
import app_constants from "../../constants/constants";
import Swal from "sweetalert2";
import { getAllProducts } from "../../APIFunctions/GetAllProducts";
import { DataContext } from "../Context/DataContext";

const AddProductModal = ({
  openAddNewProduct,
  handleClose,
  isEdit,
  currentProductID,
}) => {
  const [productNameError, setProductNameError] = useState(false);
  const [productWSPError, setProductWSPError] = useState(false);
  const [productRPError, setProductRPError] = useState(false);
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState();
  const [costPrice, setCostPrice] = useState(0);
  const [wholeSalePrice, setWholeSalePrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [description, setDescription] = useState();
  const [unit, setUnit] = useState("1");

  const { products, setProducts, setShowToast, setToastType, setToastMessage } =
    useContext(DataContext);

  useEffect(() => {
    console.log(isEdit);
    if (isEdit) {
      GetProduct(currentProductID);
    } else {
      setName("");
      setQuantity(null);
      setDescription("");
      setWholeSalePrice(0);
      setRetailPrice(0);
      setCostPrice(0);
      setUnit("1");
      setProductNameError(false);
      setProductWSPError(false);
      setProductRPError(false);
    }
  }, [isEdit, openAddNewProduct]);

  //API Functions

  const GetProduct = async (id) => {
    const res = await axios({
      url: app_constants.API_URL + `api/Products/GetProduct?ID=${id}`,
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
    });
    if (res.data.status == "Success") {
      console.log(res.data);
      var product = res.data.result;
      setName(product.name);
      setQuantity(product.quantity);
      setWholeSalePrice(product.wholeSalePrice);
      setRetailPrice(product.retailPrice);
      setDescription(product.description);
      setUnit(product.quantityUnit);
      setCostPrice(product.costPrice);
      //setOpenAddNewProduct(true);
      //setCurrProduct(res.data.data);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error occured while fetching details of the product",
        text: res.data.message,
      });
    }
  };

  const validateProductEntries = () => {
    var result = true;
    if (name === "") {
      setProductNameError(true);
      result = false;
    }
    if (wholeSalePrice === 0) {
      setProductWSPError(true);
      result = false;
    }
    if (retailPrice === 0) {
      setProductRPError(true);
      result = false;
    }
    return result;
  };

  const refreshproducts = () => {
    getAllProducts().then((res) => {
      if (res.status == "success") {
        setProducts(res.data);
      }
    });
  };

  const CreateProduct = async () => {
    if (!validateProductEntries()) {
      return;
    }
    const PostObject = {
      Name: name,
      Quantity: quantity,
      quantityUnit: unit,
      Description: description,
      WholeSalePrice: parseFloat(wholeSalePrice).toFixed(3),
      RetailPrice: parseFloat(retailPrice).toFixed(3),
      CostPrice:parseFloat(costPrice).toFixed(3)
    };
    var formdata = new FormData();
    formdata.append("Product", JSON.stringify(PostObject));

    const res = await axios({
      url: app_constants.API_URL + "api/Products/AddProduct",
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
        "content-type": "multipart/form-data",
        // "Content-type": "application/json"
      },
      data: formdata,
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request.status);
        console.log(error.request.data);
        //do something else
      } else if (error.message) {
        console.log(error.message.status);
        console.log(error.message.data);
        //do something other than the other two
      }
    });
    if (res.data.status == "Success") {
      // Swal.fire({
      //   icon: "success",
      //   title: "Product added successfully",
      // });
      setShowToast(true);
      setToastType("success");
      setToastMessage("Product added successfully");
      refreshproducts();
    } else {
      setShowToast(true);
      setToastType("success");
      setToastMessage(res.data.Message);
    }
    handleClose();
  };

  const EditProduct = async (id) => {
    const PostObject = {
      Name: name,
      Quantity: quantity,
      quantityUnit: unit,
      Description: description,
      WholeSalePrice: parseFloat(wholeSalePrice).toFixed(3),
      RetailPrice: parseFloat(retailPrice).toFixed(3),
      CostPrice:parseFloat(costPrice).toFixed(3)
    };
    // var formdata = new FormData();
    // formdata.append("Name", name);
    // formdata.append("PhoneNo", contact);
    // formdata.append("Address", address);
    // formdata.append("Description", description);
    const res = await axios({
      url: app_constants.API_URL + `api/Products/EditProduct?ID=${id}`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
      data: PostObject,
    });
    if (res.data.status == "Success") {
      setShowToast(true);
      setToastType("success");
      setToastMessage("Product details edited successfully");
      refreshproducts();
    } else {
      setShowToast(true);
      setToastType("success");
      setToastMessage(res.data.message);
    }
    handleClose();
  };
  return (
    <Modal open={openAddNewProduct} onClose={() => handleClose()}>
      <Box className={styles.AddNewCustomerModalOuter}>
        <div
          style={{
            height: "40px",
            width: "100%",
            marginLeft: "auto",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            id="confirm-document-deletion-title"
            variant="h6"
            component="h2"
          >
            {isEdit ? "Update product" : "Add new product"}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            style={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </Button>
        </div>
        <div>
          <Typography id="confirm-document-deletion-description" sx={{ mt: 2 }}>
            <div>
              <TextField
                id="newBatchName"
                size="small"
                focused
                error={productNameError}
                helperText={productNameError ? "Enter product name" : ""}
                label="Name"
                value={name}
                required
                onChange={(event) => {
                  setName(event.target.value);
                  setProductNameError(false);
                }}
                sx={{ marginTop: "25px", width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: "25px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TextField
                  id="newBatchNameAR"
                  size="small"
                  focused
                  label="Quantity"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                  }}
                  fullWidth
                  sx={{ width: "60%" }}
                />
                <FormControl fullWidth sx={{ width: "30%" }}>
                  <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    size="small"
                    id="demo-simple-select"
                    value={unit}
                    label="Age"
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <MenuItem value={"0"}>Pcs</MenuItem>
                    <MenuItem value={"1"}>Doz</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <TextField
                focused
                id="newBatchNameAR"
                size="small"
                label="Cost Price"
                value={costPrice}
                onChange={(event) => {
                  setCostPrice(event.target.value);
                }}
                sx={{ marginTop: "25px", width: "100%" }}
              />

              <TextField
                focused
                id="newBatchNameAR"
                size="small"
                label="WholeSale Price"
                required
                value={wholeSalePrice}
                error={productWSPError}
                helperText={productWSPError ? "Enter wholesale price" : ""}
                onChange={(event) => {
                  setWholeSalePrice(event.target.value);
                  setProductWSPError(false);
                }}
                sx={{ marginTop: "25px", width: "100%" }}
              />
              <TextField
                focused
                label="Retail Price"
                size="small"
                value={retailPrice}
                required
                error={productRPError}
                helperText={productRPError ? "Enter retail price" : ""}
                onChange={(event) => {
                  setRetailPrice(event.target.value);
                  setProductRPError(false);
                }}
                sx={{ marginTop: "25px", width: "100%" }}
              />
              <TextField
                focused
                id="newBatchNameAR"
                size="small"
                label="Description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                sx={{ marginTop: "25px", width: "100%" }}
                multiline
                rows={4}
              />
            </div>
          </Typography>
          <div>
            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <Button
                onClick={() => {
                  if (isEdit) {
                    EditProduct(currentProductID);
                  } else {
                    CreateProduct();
                  }
                }}
                color="primary"
                variant="contained"
              >
                {isEdit ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => handleClose()}
                sx={{ color: "#fff", marginLeft: "15px" }}
                color="error"
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
