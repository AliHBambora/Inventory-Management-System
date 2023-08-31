import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";

import ReactToPrint from "react-to-print";
import CloseIcon from "@mui/icons-material/Close";
import InvoicePrint from "../Invoices/InvoicePrint";

const InvoicePrintDialog = ({
  open,
  CloseDialog,
  invoiceDetails,
  grandTotal,
  subTotal,
  discount,
  invoiceDate,
  customerName,
  invoiceNumber,
  invoiceType
}) => {
  let componentRef = useRef();
  const handleClose = () => CloseDialog(false);
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    console.log(open);
    console.log(invoiceDetails);
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        classes={{
          paper: {
            minHeight: "80vh",
            maxHeight: "80vh",
          },
        }}
        maxWidth="md"
        fullWidth={true}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            CloseDialog(false);
          }
        }}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Invoice</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <InvoicePrint
              ref={(el) => (componentRef = el)}
              invoiceDetails={invoiceDetails}
              invoiceDate={invoiceDate}
              customerName={customerName}
              invoiceNumber={invoiceNumber}
              invoiceType={invoiceType}
              subTotal={subTotal}
              discount={discount}
              grandTotal={grandTotal}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ReactToPrint
            trigger={() => <Button variant="contained">Print</Button>}
            content={() => componentRef}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvoicePrintDialog;
