import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/customer-list-results.module.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import { GetCustomer } from "../../APIFunctions/GetCustomer";
import app_constants from "../../constants/constants";
import { DataContext } from "../Context/DataContext";
import { getAllCustomers } from "../../APIFunctions/GetAllCustomers";

const AddCustomerModal = ({ open, CloseModal, isEdit, currCustomerID }) => {
  const [name, setName] = useState("");
  const [customerNameError, setCustomerNameError] = useState(false);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [customersLoading, setCustomersLoading] = useState(false);
  const { customers, setCustomers } = useContext(DataContext);

  useEffect(() => {
    if (isEdit) {
      //Run the api function
      GetCustomer(currCustomerID).then((res) => {
        if (res.status === "success") {
          console.log(res.data);
          setName(res.data.name);
          setAddress(res.data.address);
          setContact(res.data.contact);
          setDescription(res.data.description);
        }
        setCustomersLoading(false);
      });
      return;
    }
    setName("");
    setContact("");
    setDescription("");
    setAddress("");
  }, [isEdit, open]);

  const refreshcustomers = () => {
    getAllCustomers().then((res) => {
      if (res.status == "success") {
        console.log(res.data);
        setCustomers(res.data);
      }
    });
  };

  const validateCustomerEntries = () => {
    var result = true;
    if (name === "") {
      setCustomerNameError(true);
      result = false;
    }
    return result;
  };

  const CreateCustomer = async () => {
    if(!validateCustomerEntries()){
      return;
    }
    var formdata = new FormData();
    formdata.append("Name", name);
    formdata.append("Contact", contact);
    formdata.append("Address", address);
    formdata.append("Description", description);

    const res = await axios({
      url: app_constants.API_URL + "api/Customers/AddCustomer",
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
        "content-type": "multipart/form-data",
      },
      data: formdata,
    });
    if (res.data.status === "Success") {
      Swal.fire({
        icon: "success",
        title: "Customer added successfully",
      });
      refreshcustomers();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error Occured",
        text: res.data.Message,
      });
    }
    CloseModal();
  };

  const EditCustomer = async (id) => {
    var formdata = new FormData();
    formdata.append("Name", name);
    formdata.append("PhoneNo", contact);
    formdata.append("Address", address);
    formdata.append("Description", description);
    const res = await axios({
      url: app_constants.API_URL + `api/Customers/EditCustomer?ID=${id}`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
      data: formdata,
    });
    if (res.data.status === "Success") {
      Swal.fire({
        icon: "success",
        title: "Customer details successfully updated",
      });
      refreshcustomers();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error occured while editing",
        text: res.data.message,
      });
    }
    CloseModal();
  };
  return (
    <Modal open={open} handleClose={() => CloseModal()}>
      <Box className={styles.AddNewCustomerModalOuter}>
        {customersLoading ? (
          <div style={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
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
                {/* Create New Batch */}
                {isEdit ? "Update Customer" : "Add new Customer"}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => CloseModal()}
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
                    size="small"
                    label="Name"
                    required
                    error={customerNameError}
                    helperText={customerNameError ? "Enter customer name" : ""}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if(event.target.value!=""){
                        setCustomerNameError(false);
                      }
                    }}
                    sx={{ marginTop: "25px", width: "100%" }}
                  />
                  <TextField
                    id="newBatchNameAR"
                    size="small"
                    label="Contact No"
                    value={contact}
                    onChange={(event) => {
                      setContact(event.target.value);
                    }}
                    sx={{ marginTop: "25px", width: "100%" }}
                  />
                  <TextField
                    id="newBatchNameAR"
                    size="small"
                    label="Address"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                    }}
                    sx={{ marginTop: "25px", width: "100%" }}
                  />
                  <TextField
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
                        EditCustomer(currCustomerID);
                      } else {
                        CreateCustomer();
                      }
                    }}
                    color="primary"
                    variant="contained"
                  >
                    {isEdit ? "Update" : "Create"}
                  </Button>
                  <Button
                    onClick={() => CloseModal()}
                    sx={{ color: "#fff", marginLeft: "15px" }}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
