import {
  Autocomplete,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import styles from "../../styles/invoice.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InvoicePrintDialog from "../modals/InvoicePrintDialog";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { DataContext } from "../Context/DataContext";
import app_constants from "../../constants/constants";
import { getAllProducts } from "../../APIFunctions/GetAllProducts";
import dayjs from "dayjs";

const Invoice = ({
  invoiceDate,
  customerName,
  invoiceNumber,
  invoiceType,
  customer,
  getTotalAmount,
  amountPaid,
}) => {
  const [openInvoicePrintDialog, setOpenInvoicePrintDialog] = useState(false);
  const [inputValue, setinputValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState();

  const [invoiceDetails, setInvoiceDetails] = useState([
    {
      id: "",
      Item: "",
      description: "",
      qty: 0,
      unit: 0, //Doz
      price: 0,
      total: 0,
    },
  ]);

  const [grandTotal, setGrandTotal] = useState(null);
  const [subTotal, setSubTotal] = useState(null);
  const [discount, setDiscount] = useState(0);

  const { products, setProducts } = useContext(DataContext);

  useEffect(() => {}, [invoiceDetails]);

  useEffect(() => {
    getAllProducts().then((res) => {
      if (res.status == "success") {
        setProducts(res.data);
      }
    });
    if (sessionStorage.getItem("Invoice") != null) {
      var invoiceData = JSON.parse(sessionStorage.getItem("Invoice"));
      setInvoiceDetails(invoiceData.productList);
      setDiscount(invoiceData.discount);
      setGrandTotal(invoiceData.totalAmount);
      setSubTotal(invoiceData.totalAmount - invoiceData.discount);
    }
  }, []);

  const handleInvoiceDetailsChanged = (index, event) => {
    let lineItems = invoiceDetails.map((item, i) => {
      if (index !== i) return item;
      return { ...item, [event.target.name]: event.target.value };
    });
    if (event.target.name == "Qty" || event.target.name == "Price") {
      lineItems[index].total = lineItems[index].qty * lineItems[index].price;
      var result = 0;
      lineItems.map((item) => (result = result + item.total));
      setSubTotal(result);
      setGrandTotal(result - discount);
      getTotalAmount(result - discount);
    }
    console.log(lineItems);
    setInvoiceDetails(lineItems);
  };

  const AddItem = (event) => {
    setInvoiceDetails(
      invoiceDetails.concat([
        {
          Item: "",
          description: "",
          qty: 0,
          unit: 0,
          price: 0,
          total: 0,
        },
      ])
    );
  };

  const RemoveItem = (index) => {
    setInvoiceDetails(
      invoiceDetails.filter((item, i) => {
        return index !== i;
      })
    );
    setSubTotal(subTotal - invoiceDetails[index].total);
    setGrandTotal(grandTotal - invoiceDetails[index].total);
    getTotalAmount(grandTotal - invoiceDetails[index].total);
    //setGrandTotal(grandTotal-invoiceDetails[index].Total);
  };

  const GenerateInvoice = async () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to generate new invoice?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor:"green",
      cancelButtonColor:"red"
    }).then(async (res) => {
      if (res.isConfirmed) {
        const POSTOBJ = {
          InvoiceNumber: invoiceNumber,
          InvoiceDate: invoiceDate,
          TotalAmount: grandTotal,
          Discount: discount,
          Status: invoiceType,
          Comments: "",
          customer: customer,
          Profit: 0,
          AmountPaid: amountPaid,
          productList: invoiceDetails,
        };
        const res = await axios({
          url: app_constants.API_URL + "api/Invoices/AddInvoice",
          method: "POST",
          headers: {
            Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
          },
          data: POSTOBJ,
        });
        if (res.data.status == "Success") {
          Swal.fire({
            icon: "error",
            text: res.data.Message,
            timer: 1000,
          });
          setOpenInvoicePrintDialog(true);
        } else {
          Swal.fire({
            icon: "error",
            text: res.data.Message,
          });
        }
        console.log(invoiceDetails);
      }
    });
  };

  const onProductSelection = (e, value, index) => {
    console.log(value);
    invoiceDetails[index].id = value.id;
    invoiceDetails[index].name = value.name;
    invoiceDetails[index].Item = value.name;
    invoiceDetails[index].description = value.description;
    invoiceDetails[index].price = value.wholeSalePrice;
    setInvoiceDetails(invoiceDetails);
    setToggle(!toggle);
  };

  const [toggle, setToggle] = useState(true);

  return (
    <div className="NewInvoice_InvoiceContainer">
      <table className={styles.styled_table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoiceDetails.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <Autocomplete
                  value={item}
                  freeSolo
                  onChange={(e, value) => onProductSelection(e, value, index)}
                  inputValue={item?.name}
                  onInputChange={(event, newInputValue) => {
                    console.log(newInputValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                  }
                  id="combo-box-demo"
                  options={products}
                  getOptionLabel={(option) => option.name || ""}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                      variant="outlined"
                    />
                  )}
                  // open={inputValue.length > 2}
                />
              </td>
              <td>
                <TextField
                  // fullWidth
                  key={index}
                  name="Description"
                  size="small"
                  id="outlined-name"
                  variant="outlined"
                  value={item.description}
                  onChange={(e) => handleInvoiceDetailsChanged(index, e)}
                />
              </td>
              <td>
                <TextField
                  // fullWidth
                  name="Qty"
                  size="small"
                  id="outlined-name"
                  variant="outlined"
                  value={item.qty}
                  onChange={(e) => handleInvoiceDetailsChanged(index, e)}
                />
              </td>
              <td className={styles.Unit}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={item.unit}
                    label="Age"
                    name="Unit"
                    onChange={(e) => handleInvoiceDetailsChanged(index, e)}
                  >
                    <MenuItem value={0}>Doz</MenuItem>
                    <MenuItem value={1}>Pcs</MenuItem>
                  </Select>
                </FormControl>
              </td>
              <td>
                <TextField
                  // fullWidth
                  key={index}
                  name="Price"
                  size="small"
                  id="outlined-name"
                  variant="outlined"
                  value={item.price}
                  onChange={(e) => handleInvoiceDetailsChanged(index, e)}
                />
              </td>
              <td>
                <TextField
                  // fullWidth
                  key={index}
                  name="Total"
                  size="small"
                  id="outlined-name"
                  variant="outlined"
                  value={item.total}
                  inputProps={{ readOnly: true }}

                  //   onChange={(e) => handleInvoiceTotalChange(index, e)}
                />
              </td>
              <td>
                <IconButton onClick={() => RemoveItem(index)}>
                  <HighlightOffIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.NewInvoice_ButtonContainer}>
        <Button
          color="success"
          size="large"
          type="submit"
          variant="contained"
          // startIcon={<AddCircleOutlineIcon />}
          onClick={GenerateInvoice}
        >
          Generate Invoice
        </Button>
        <Button
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={AddItem}
        >
          Add Item
        </Button>
      </div>

      <div className={styles.NewInvoice_GrandTotalContainer}>
        <div className={styles.GrandTotalBox}>
          <Typography variant="h6">SubTotal</Typography>
          <TextField
            // fullWidth
            name="SubTotal"
            size="small"
            id="outlined-name"
            // variant="outlined"
            value={subTotal}
            focused
            inputProps={{ readOnly: true }}
          />
        </div>

        <div className={styles.GrandTotalBox}>
          <Typography variant="h6">Discount</Typography>
          <TextField
            // fullWidth
            name="Discount"
            size="small"
            id="outlined-name"
            // variant="outlined"
            value={discount}
            focused
            onChange={(e) => {
              setDiscount(e.target.value);
              setGrandTotal(subTotal - e.target.value);
              getTotalAmount(subTotal - e.target.value);
            }}
          />
        </div>

        <div className={styles.GrandTotalBox}>
          <Typography variant="h6">Grand Total</Typography>
          <TextField
            // fullWidth
            name="GrandTotal"
            size="small"
            id="outlined-name"
            // variant="outlined"
            value={grandTotal}
            focused
            inputProps={{ readOnly: true }}
          />
        </div>
      </div>

      <InvoicePrintDialog
        open={openInvoicePrintDialog}
        CloseDialog={(val) => setOpenInvoicePrintDialog(val)}
        invoiceDetails={invoiceDetails}
        grandTotal={grandTotal}
        subTotal={subTotal}
        discount={discount}
        invoiceDate={invoiceDate}
        customerName={customerName}
        invoiceNumber={invoiceNumber}
        invoiceType={invoiceType}
      />
    </div>
  );
};

export default Invoice;
