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
import { getAllProducts } from "../../API/GetAllProducts";
import { DataContext } from "../Context/DataContext";
import { APIRequest } from "../../API/APIRequest";
import endpoints from "../../API/endpoints";

const AddProductModal = ({
  openAddNewProduct,
  handleClose,
  isEdit,
  product,
}) => {
  const [productNameError, setProductNameError] = useState(false);
  const [productWSPError, setProductWSPError] = useState(false);
  const [productRPError, setProductRPError] = useState(false);
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState();
  const [wholeSalePrice, setWholeSalePrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [description, setDescription] = useState();
  const [unit, setUnit] = useState(1);

  const { products, setProducts } = useContext(DataContext);

  useEffect(() => {
    if (isEdit) {
      setName(product.name);
      setQuantity(product.quantity);
      setWholeSalePrice(product.wholeSalePrice);
      setRetailPrice(product.retailPrice);
      setDescription(product.description);
      setUnit(product.unit);
    } else {
      setName("");
      setQuantity(null);
      setDescription("");
      setWholeSalePrice(0);
      setRetailPrice(0);
      setUnit(1);
    }
  }, []);

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
    };
    var formdata = new FormData();
    formdata.append("Product", JSON.stringify(PostObject));
    APIRequest.post(endpoints.ADDPRODUCT, formdata)
      .then((res) => {
        if (res.status === app_constants.SUCCESS) {
          Swal.fire({
            icon: "success",
            title: "Product added successfully",
          });
          refreshproducts();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error Occured",
            text: res.data.Message,
          });
        }
        handleClose();
      })
      .catch((err) => alert(err));
  };

  const EditProduct = async (id) => {
    const PostObject = {
      Name: name,
      Quantity: quantity,
      quantityUnit: unit,
      Description: description,
      WholeSalePrice: parseFloat(wholeSalePrice),
      RetailPrice: parseFloat(retailPrice),
    };
    APIRequest.post(endpoints.EDITPRODUCT+`?ID=${id}`,PostObject).then((res)=>{
      if (res.status ===app_constants.SUCCESS) {
        Swal.fire({
          icon: "success",
          title: "Products details successfully updated",
        });
        refreshproducts();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error occured while editing",
          text: res.data.message,
        });
      }
      handleClose();
    })
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
                    id="demo-simple-select"
                    value={unit}
                    label="Age"
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <MenuItem value={0}>Pcs</MenuItem>
                    <MenuItem value={1}>Doz</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <TextField
                focused
                id="newBatchNameAR"
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
                    EditProduct(product.id);
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
