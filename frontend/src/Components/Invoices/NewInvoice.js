import { Autocomplete, IconButton, TextField } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import Switch from "@mui/material/Switch";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { setIn } from "formik";
import dayjs from "dayjs";
import styles from "../../styles/newInvoice.module.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import Invoice from "./Invoice";
import { DataContext } from "../Context/DataContext";
import { getAllCustomers } from "../../APIFunctions/GetAllCustomers";
import AddCustomerModal from "../modals/AddCustomerModal";

const NewInvoice = () => {
  const [invoiceDate, setInvoiceDate] = useState(dayjs(new Date()));
  const [customerName, setCustomerName] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [customer, setCustomer] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceNumberError, setInvoiceNumberError] = useState(false);
  const [customerError, setCustomerError] = useState(false);

  const [invoiceType, setInvoiceType] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountRemaining, setAmountRemaining] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [showAmountPaidOption, setShowAmountPaidOption] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [openAddNewCustomer, setOpenAddNewCustomer] = useState(false);
  const { customers, setCustomers } = useContext(DataContext);
  // const handleSwitchChange = (event) => {
  //   setChecked(event.target.checked);
  // };

  useEffect(() => {
    if (customers.length == 0) {
      setCustomersLoading(true);
      getAllCustomers().then((res) => {
        if (res.status == "success") {
          console.log(res.data);
          setCustomers(res.data);
        }
        setCustomersLoading(false);
      });
    }
    if (sessionStorage.getItem("Invoice") != null) {
      var invoiceData = JSON.parse(sessionStorage.getItem("Invoice"));
      setCustomer(invoiceData.customer);
      setInvoiceNumber(invoiceData.invoiceNumber);
      setInvoiceDate(invoiceData.invoiceDate);
    }
  }, []);

  const validateInvoice = (arr) => {
    if (arr?.includes("invoiceNumber")) {
      setInvoiceNumberError(true);
    }
    if (arr?.includes("customer")) {
      setCustomerError(true);
    }
  };

  const CloseModal = () => {
    setOpenAddNewCustomer(false);
  };

  return (
    <>
      <PerfectScrollbar>
        <div className="NewInvoice_Container">
          {/* The top container having invoice number,cash/credit,Date */}
          <div className={styles.NewInvoice_TopContainer}>
            <TextField
              // fullWidth
              error={invoiceNumberError}
              helperText={invoiceNumberError ? "Enter Invoice number" : ""}
              focused
              style={{ width: "30%" }}
              id="outlined-name"
              label="Invoice Number"
              variant="outlined"
              value={invoiceNumber}
              onChange={(e) => {
                setInvoiceNumber(e.target.value);
                setInvoiceNumberError(false);
              }}
            />
            <FormControl focused sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">
                Invoice Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={invoiceType}
                label="Invoice Type"
                onChange={(e) => {
                  setInvoiceType(e.target.value);
                  if (e.target.value === "Credit") {
                    setShowAmountPaidOption(true);
                    setAmountPaid(0);
                  } else {
                    setShowAmountPaidOption(false);
                    setAmountPaid(invoiceTotal);
                  }
                }}
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Credit">Credit</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Date"
                value={invoiceDate}
                onChange={(newValue) => {
                  setInvoiceDate(newValue);
                  console.log(newValue);
                }}
                renderInput={(params) => (
                  <TextField sx={{ width: "30%" }} {...params} focused />
                )}
              />
            </LocalizationProvider>
          </div>

          {/* Name of the customer */}
          <div className={styles.NewInvoice_NameContainer}>
            <div className={styles.CustomerContainer}>
            <Autocomplete
              style={{width:"100%"}}
              value={customer}
              onChange={(event, newValue) => {
                console.log(newValue);
                setCustomer(newValue);
                setCustomerError(false);
              }}
              inputValue={customerName}
              onInputChange={(event, newInputValue) => {
                console.log(newInputValue);
                setCustomerName(newInputValue);
              }}
              getOptionLabel={(option) => option.name}
              id="controllable-states-demo"
              options={customers}
              loading={customersLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer"
                  error={customerError}
                  helperText={customerError ? "Select Customer" : ""}
                  focused
                  fullWidth
                />
              )}
            />
            <IconButton
              onClick={()=>setOpenAddNewCustomer(true)}
            >
              <AddIcon fontSize="small"/>
            </IconButton>
            </div>
            {/* <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}} hidden={!showAmountPaidOption}> */}
            <TextField
              fullWidth
              style={
                showAmountPaidOption
                  ? { display: "block", width: "30%" }
                  : { display: "none", width: "30%" }
              }
              focused
              id="outlined-name"
              label="Amount Paid"
              variant="outlined"
              value={amountPaid}
              onChange={(e) => {
                setAmountPaid(e.target.value);
                setAmountRemaining(invoiceTotal - e.target.value);
              }}
            />

            <TextField
              fullWidth
              focused
              style={
                showAmountPaidOption
                  ? { display: "block", width: "30%" }
                  : { display: "none", width: "30%" }
              }
              id="outlined-name"
              label="Amount Remaining"
              variant="outlined"
              value={amountRemaining}
              disabled
            />
          </div>
          {/* </div> */}

          <Invoice
            invoiceDate={invoiceDate}
            customerName={customerName}
            invoiceNumber={invoiceNumber}
            invoiceType={invoiceType}
            customer={customer}
            getTotalAmount={(val) => {
              setInvoiceTotal(val);
              setAmountRemaining(val - amountPaid);
            }}
            generateInvoiceCallBack={(arr) => validateInvoice(arr)}
            amountPaid={amountPaid}
          />

           {/* Add new Customer Modal */}
     <AddCustomerModal open={openAddNewCustomer} CloseModal={CloseModal} isEdit={false} currCustomerID=""/>
        </div>
      </PerfectScrollbar>
    </>
  );
};

export default NewInvoice;
