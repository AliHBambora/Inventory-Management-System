import { Typography } from "@mui/material";
import React, { Component } from "react";
import styles from "../../styles/invoicePrint.module.css";
import tableStyles from "../../styles/invoice.module.css";

//This has been created as a class component as react-to-print library does not work well with functional components

class InvoicePrint extends Component {
  render() {
    return (
      <div className={styles.MainContainer}>
        <div className={styles.InvoiceTitleContainer}>
          <Typography variant="h3">INVOICE</Typography>
          <div className={styles.InvoiceLogoContainer}>
            <Typography variant="h6">
              Golden&nbsp;Fanaar&nbsp;Center&nbsp;Cosmetics&nbsp;&amp;Perfumes
            </Typography>
            <Typography variant="h5">
              والعطور&nbsp;للتجميل&nbsp;الذهبي&nbsp;الفنار&nbsp;مركز
            </Typography>
          </div>
        </div>

        <div className={styles.InvoiceDetailsContainer}>
          <div className={styles.InvoiceDetailRow}>
            <Typography variant="h5" style={{ marginRight: "5px" }}>
              Invoice&nbsp;Number
            </Typography>
            <Typography variant="h6">{this.props.invoiceNumber}</Typography>
          </div>
          <div className={styles.InvoiceDetailRow}>
            <Typography variant="h5" style={{ marginRight: "5px" }}>
              Billed&nbsp;To
            </Typography>
            <Typography variant="h6">{this.props.customerName}</Typography>
          </div>
          <div className={styles.InvoiceDetailRow}>
            <Typography variant="h5" style={{ marginRight: "5px" }}>
              Date
            </Typography>
            <Typography variant="h6">{this.props.invoiceDate.format('YYYY-MM-DD [at] HH:mm:ss')}</Typography>
          </div>
        </div>

        <div className={styles.InvoiceTableContainer}>
          <table className={tableStyles.styled_table} style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {this.props.invoiceDetails.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.Item}</td>
                  <td>{item.Description}</td>
                  <td>{item.Qty}</td>
                  <td>{item.Price}</td>
                  <td>{item.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.NewInvoice_GrandTotalContainer}>
          <div className={styles.GrandTotalBox}>
            <p className={styles.GrandTotalText}>SubTotal</p>
            {this.props.subTotal}
          </div>

          <div className={styles.GrandTotalBox}>
            <p className={styles.GrandTotalText}>Discount</p>
            {this.props.discount}
          </div>

          <div className={styles.GrandTotalBox}>
            <p className={styles.GrandTotalText}>Grand&nbsp;Total</p>
            {this.props.grandTotal}
          </div>
        </div>

        <div className={styles.NewInvoice_Signature}>
          <div className={styles.SignatureContainer}>
            <p style={{ fontSize: "16px", fontWeight: 500,margin:0,color:"black" }}>
              Customer Signature
            </p>
          </div>
          <div className={styles.SignatureContainer}>
            <p style={{ fontSize: "16px", fontWeight: 500,margin:0,color:"black" }}>
              Supplier Signature
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default InvoicePrint;
