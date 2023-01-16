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
} from "@mui/material";
import React, { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import app_constants from "../../constants/constants.js";
import dayjs from "dayjs";
import { Link, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { APIRequest } from "../../API/APIRequest.js";
import endpoints from "../../API/endpoints.js";

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
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const newInvoiceRef = useRef(null);

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
    APIRequest.post(endpoints.GETINVOICE, formdata).then((res) => {
      if (res.status == "success") {
        sessionStorage.setItem("Invoice", JSON.stringify(res.data.data[0]));
        sessionStorage.setItem("InvoiceID", ID);
        newInvoiceRef.current.click();
      } else {
        Swal.fire({
          icon: "error",
          text: "res.data.Message",
        });
      }
    });
  };

  const DeleteInvoice = async (id) => {
    APIRequest.post(endpoints.DELETEINVOICE + `?ID=${id}`, "").then((res) => {
      if (res.status == "success") {
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
    });
  };

  return (
    <>
      <PerfectScrollbar>
        <Table>
          <TableHead>
            <TableRow style={{ fontSize: "18px", fontWeight: 600 }}>
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
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>
                  {dayjs(invoice.invoiceDate).format("DD/MM/YYYY hh:mm A")}
                </TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
                <TableCell>{invoice.amountPaid}</TableCell>
                <TableCell>{invoice.amountDue}</TableCell>

                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={invoice.status == "Credit" ? "error" : "success"}
                  />
                </TableCell>

                <TableCell style={{ display: "flex" }}>
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      onClick={() => getInvoice(invoice.invoiceId)}
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
      <Link to="/createInvoice" ref={newInvoiceRef} />
      <Outlet />
    </>
  );
};

export default InvoiceTable;
