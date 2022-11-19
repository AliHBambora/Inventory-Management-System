import { useContext, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../../styles/customer-list-results.module.css";
import { Upload as UploadIcon } from "../icons/upload";
import { Download as DownloadIcon } from "../icons/download";
import AddIcon from "@mui/icons-material/Add";

import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { getInitials } from "../utils/get-initials";
import { Search as SearchIcon } from "../icons/search";
import axios from "axios";
import app_constants from "../../constants/constants";
import Swal from "sweetalert2";
import { DataContext } from "../Context/DataContext";

export const ProductsListResults = ({ refreshproducts, ...rest }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currProductID, setCurrProductID] = useState("");
  const [openAddNewProduct, setOpenAddNewProduct] = useState(false);
  const [name, setName] = useState();
  const [quantity, setQuantity] = useState();
  const [wholeSalePrice, setWholeSalePrice] = useState(0);
  const [retailPrice, setRetailPrice] = useState(0);
  const [description, setDescription] = useState();
  const [unit, setUnit] = useState(1);
  const [isEdit, setIsEdit] = useState(false);

  const {products} = useContext(DataContext);

  useEffect(() => {
    setDisplayedProducts(products);
  }, [products]);

  const handleSelectAll = (event) => {
    let newSelectedProductIds;

    if (event.target.checked) {
      newSelectedProductIds = products.map((product) => product.id);
    } else {
      newSelectedProductIds = [];
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedProductIds.indexOf(id);
    let newSelectedProductIds = [];

    if (selectedIndex === -1) {
      newSelectedProductIds = newSelectedProductIds.concat(
        selectedProductIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedProductIds = newSelectedProductIds.concat(
        selectedProductIds.slice(1)
      );
    } else if (selectedIndex === selectedProductIds.length - 1) {
      newSelectedProductIds = newSelectedProductIds.concat(
        selectedProductIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedProductIds = newSelectedProductIds.concat(
        selectedProductIds.slice(0, selectedIndex),
        selectedProductIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    if (e.target.value == "") {
      setDisplayedProducts(products);
    } else {
      var result = products.filter((x) =>
        x.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setDisplayedProducts(result);
    }

    // props.setproductsValue(result);
  };

  const handleClose = () => {
    setOpenAddNewProduct(false);
    setName("");
    setQuantity(null);
    setDescription("");
    setWholeSalePrice(null);
    setRetailPrice(null);
    setUnit(1);
  };

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
      setName(res.data.result.name);
      setQuantity(res.data.result.quantity);
      setWholeSalePrice(res.data.result.wholeSalePrice);
      setRetailPrice(res.data.result.retailPrice);
      setDescription(res.data.result.description);
      setUnit(res.data.result.unit);
      setOpenAddNewProduct(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error occured while fetching details of the product",
        text: res.data.message,
      });
    }
  };

  const DeleteProduct = async (id) => {
    const res = await axios({
      url: app_constants.API_URL + `api/Products/DeleteProduct?ID=${id}`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
    });
    if (res.data.status == "Success") {
      Swal.fire({
        icon: "success",
        title: "product successfully deleted",
      });
      refreshproducts();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error occured while deleting product",
        text: res.data.message,
      });
    }
  };

  const CreateProduct = async () => {
    const PostObject = {
      Name: name,
      Quantity: quantity,
      quantityUnit: unit,
      Description: description,
      WholeSalePrice: parseFloat(wholeSalePrice),
      RetailPrice:parseFloat(retailPrice),
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
  };

  const EditProduct = async (id) => {
    const PostObject = {
      Name: name,
      Quantity: quantity,
      quantityUnit: unit,
      Description: description,
      WholeSalePrice:parseFloat(wholeSalePrice),
      RetailPrice: parseFloat(retailPrice),
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
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
            backgroundColor: "#f9fafc",
          }}
        >
          <Typography sx={{ m: 1 }} variant="h4">
            Products
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
              Import
            </Button>
            <Button
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ mr: 1 }}
            >
              Export
            </Button>
            <Button
              endIcon={<AddIcon />}
              color="primary"
              variant="contained"
              onClick={() => {
                setOpenAddNewProduct(true);
                setName("");
                setQuantity(null);
                setDescription("");
                setWholeSalePrice(null);
                setRetailPrice(null);
                setUnit(1);
              }}
            >
              Add products
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: "30px", marginBottom: "30px" }}>
          <Card>
            <CardContent style={{ padding: "15px", borderRadius: "10px" }}>
              <Box sx={{ maxWidth: 500, backgroundColor: "#ffffff" }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search product"
                  variant="outlined"
                  onChange={handleSearchChange}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProductIds.length === products.length}
                    color="primary"
                    indeterminate={
                      selectedProductIds.length > 0 &&
                      selectedProductIds.length < products.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                {/* <TableCell>
                  Email
                </TableCell> */}
                <TableCell>Quantity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>WholeSale Price</TableCell>
                <TableCell>Retail Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProducts?.slice(0, limit).map((product) => (
                <TableRow
                  hover
                  key={product.id}
                  selected={selectedProductIds.indexOf(product.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedProductIds.indexOf(product.id) !== -1}
                      onChange={(event) => handleSelectOne(event, product.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar
                        src={product.avatarUrl}
                        sx={{ mr: 2, background: "#2e3e7c" }}
                      >
                        {getInitials(product.name)}
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {product.quantity}{" "}
                    {product.quantityUnit == 0 ? "Pcs" : "Doz"}
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.wholeSalePrice} </TableCell>
                  <TableCell>{product.retailPrice} </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setIsEdit(true);
                          GetProduct(product.id);
                          setCurrProductID(product.id);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() =>
                          Swal.fire({
                            icon: "question",
                            title:
                              "Are you sure you want to delete this product?",
                            showConfirmButton: true,
                            confirmButtonText: "Yes",
                            showCancelButton: true,
                            cancelButtonText: "Cancel",
                          }).then((res) => {
                            if (res.isConfirmed) {
                              DeleteProduct(product.id);
                            }
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={products.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Add new product Modal */}
      <Modal open={openAddNewProduct} onClose={handleClose}>
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
            <Typography
              id="confirm-document-deletion-description"
              sx={{ mt: 2 }}
            >
              <div>
                <TextField
                  id="newBatchName"
                  focused
                  label="Name"
                  value={name}
                  required
                  onChange={(event) => {
                    setName(event.target.value);
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
                    required
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
                  value={wholeSalePrice}
                  onChange={(event) => {
                    setWholeSalePrice(event.target.value);
                  }}
                  sx={{ marginTop: "25px", width: "100%" }}
                />

                <TextField
                  focused
                  label="Retail Price"
                  value={retailPrice}
                  onChange={(event) => {
                    setRetailPrice(event.target.value);
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
                      EditProduct(currProductID);
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
                  onClick={handleClose}
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
    </Card>
  );
};

ProductsListResults.propTypes = {
  products: PropTypes.array.isRequired,
};
