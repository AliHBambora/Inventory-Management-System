import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import app_constants from "../../constants/constants.js";
import dayjs from "dayjs";
import { Link, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { grey } from "@mui/material/colors";
import InvoicePrintDialog from "../modals/InvoicePrintDialog.js";

const InvoiceTable = ({ data }) => {
  const Invoice = [
    {
      id: "1",
      InvoiceNumber: "3560",
      CustomerName: "Ahmed",
      IssuedDate: "",
      Total: 650,
      Status: "Pending",
    },
  ];
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const newInvoiceRef = useRef(null);
  const [openInvoicePrintDialog, setOpenInvoicePrintDialog] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [invoiceDate, setInvoiceDate] = useState(dayjs(new Date()));
  const [customerName, setCustomerName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedInvoiceIds;

    if (event.target.checked) {
      newSelectedInvoiceIds = data.map((invoice) => invoice.id);
    } else {
      newSelectedInvoiceIds = [];
    }

    setSelectedInvoiceIds(newSelectedInvoiceIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedInvoiceIds.indexOf(id);
    let newselectedInvoiceIds = [];

    if (selectedIndex === -1) {
      newselectedInvoiceIds = newselectedInvoiceIds.concat(
        selectedInvoiceIds,
        id
      );
    } else if (selectedIndex === 0) {
      newselectedInvoiceIds = newselectedInvoiceIds.concat(
        selectedInvoiceIds.slice(1)
      );
    } else if (selectedIndex === selectedInvoiceIds.length - 1) {
      newselectedInvoiceIds = newselectedInvoiceIds.concat(
        selectedInvoiceIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newselectedInvoiceIds = newselectedInvoiceIds.concat(
        selectedInvoiceIds.slice(0, selectedIndex),
        selectedInvoiceIds.slice(selectedIndex + 1)
      );
    }
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  //API functions

  const getInvoice = async (ID) => {
    var formdata = new FormData();
    formdata.append("ID", ID);
    const res = await axios({
      url: app_constants.API_URL + "api/Invoices/GetInvoice",
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
      data: formdata,
    });
    return res;
  };

  const DeleteInvoice = async (id) => {
    const res = await axios({
      url: app_constants.API_URL + `api/Invoices/DeleteInvoice?ID=${id}`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
    });
    if (res.data.status == "success") {
      Swal.fire({
        icon: "success",
        text: "Invoice deleted successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        text: res.Message,
      });
    }
  };

  return (
    <>
      <PerfectScrollbar>
        <Table>
          <TableHead>
            <TableRow sx={{ fontSize: 18, fontWeight: 600 }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedInvoiceIds.length === data.length}
                  color="primary"
                  indeterminate={
                    selectedInvoiceIds.length > 0 &&
                    selectedInvoiceIds.length < data.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Invoice Number</TableCell>
              {/* <TableCell>
                  Email
                </TableCell> */}
              <TableCell>Customer Name</TableCell>
              <TableCell>Issued Date</TableCell>
              <TableCell>Invoice Total Value</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Amount Due</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, limit).map((invoice) => (
              <TableRow
                hover
                key={invoice.id}
                selected={selectedInvoiceIds.indexOf(invoice.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedInvoiceIds.indexOf(invoice.id) !== -1}
                    onChange={(event) => handleSelectOne(event, invoice.id)}
                    value="true"
                  />
                </TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
                  <Typography
                    color="textPrimary"
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    {invoice.customerName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body2">
                    {dayjs(invoice.invoiceDate).format("DD/MM/YYYY hh:mm A")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body2">
                    {invoice.totalAmount}{" "}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textPrimary" variant="body2">
                    {invoice.amountPaid}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "#FF0000" }} variant="body2">
                    {invoice.amountDue}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={invoice.status == "Credit" ? "error" : "success"}
                  />
                </TableCell>

                <TableCell style={{}}>
                  <div
                    style={{
                      backgroundColor: "#D3D3D3",
                      display: "flex",
                      borderRadius: 10,
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          getInvoice(invoice.invoiceId).then((res) => {
                            if (res.data.status == "success") {
                              sessionStorage.setItem(
                                "Invoice",
                                JSON.stringify(res.data.data[0])
                              );
                              sessionStorage.setItem(
                                "InvoiceID",
                                invoice.invoiceId
                              );
                              newInvoiceRef.current.click();
                            }
                          })
                        }
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
                              "Are you sure you want to delete this customer?",
                            showConfirmButton: true,
                            confirmButtonText: "Yes",
                            showCancelButton: true,
                            cancelButtonText: "Cancel",
                          }).then((res) => {
                            if (res.isConfirmed) {
                              DeleteInvoice(invoice.invoiceId);
                            }
                          })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                      <IconButton
                        color="info"
                        onClick={() =>
                          getInvoice(invoice.invoiceId).then((res) => {
                            console.log(res.data.data[0].productList);
                            if (res.data.status == "success") {
                              setGrandTotal(res.data.data[0].totalAmount);
                              setSubTotal(
                                res.data.data[0].totalAmount -
                                  res.data.data[0].discount
                              );
                              setDiscount(res.data.data[0].discount);
                              setInvoiceDate(res.data.data[0].invoiceDate);
                              setCustomerName(res.data.data[0].customer.name);
                              setInvoiceNumber(res.data.data[0].invoiceNumber);
                              setInvoiceType(res.data.data[0].status);
                              setInvoiceDetails(res.data.data[0].productList);
                              setOpenInvoicePrintDialog(true);
                            }
                          })
                        }
                      >
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Invoice Print Dialog */}
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

      <Link to="/createInvoice" ref={newInvoiceRef} />
      <Outlet />
    </>
  );
};

export default InvoiceTable;
