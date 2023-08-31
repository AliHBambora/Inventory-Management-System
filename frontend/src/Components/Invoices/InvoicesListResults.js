import React, { useContext, useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@mui/icons-material/Add";
import { Search as SearchIcon } from "../icons/search";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import InvoiceTable from "./InvoiceTable";
import { Outlet, Link } from "react-router-dom";
import { DataContext } from "../Context/DataContext";
import InvoiceFilterCard from "./InvoiceFilterCard";
import { APIFunction } from "../../APIFunctions/GetAllCustomers";

const InvoicesListResults = ({ ...rest }) => {
  const [tabvalue, setTabValue] = useState("1");
  const [displayedInvoices, setDisplayedInvoices] = useState([]);
  const { invoices } = useContext(DataContext);
  const newInvoiceRef = useRef(null);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case "1":
        setDisplayedInvoices(invoices);
        break;
      case "2":
        setDisplayedInvoices(invoices.filter((inv) => inv.status === "Credit"));
        break;
      case "3":
        setDisplayedInvoices(invoices.filter((inv) => inv.status === "Cash"));
        break;
    }
  };

  useEffect(() => {
    console.log("useEffect");
    setDisplayedInvoices(invoices);
  }, [invoices]);

  return (
    <Card {...rest} sx={{ backgroundColor: "#f9fafc" }}>
      <PerfectScrollbar>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Typography sx={{ m: 1 }} variant="h4">
            Invoices
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button
              endIcon={<AddIcon />}
              color="primary"
              variant="contained"
              onClick={() => {
                sessionStorage.removeItem("Invoice");
                sessionStorage.removeItem("InvoiceID");
                newInvoiceRef.current.click();
              }}
            >
              Add Invoice
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: "15px", marginBottom: "30px" }}>
          <Box sx={{ marginTop: "10px" }}>
            <InvoiceFilterCard />
            <Card>
              <CardContent sx={{ backgroundColor: "#f9fafc",padding:0}}>
                {/* Tab structure for type of invoices ie. Pending,Paid */}
                <Box
                  sx={{ width: "100%", typography: "body1"}}
                >
                  <TabContext value={tabvalue}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleTabChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="All" value="1" />
                        <Tab label="Pending" value="2" />
                        <Tab label="Paid" value="3" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <InvoiceTable data={displayedInvoices} />
                    </TabPanel>
                    <TabPanel value="2">
                      <InvoiceTable data={displayedInvoices} />
                    </TabPanel>
                    <TabPanel value="3">
                      <InvoiceTable data={displayedInvoices} />
                    </TabPanel>
                  </TabContext>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </PerfectScrollbar>
      <Link to="/createInvoice" ref={newInvoiceRef} />
      <Outlet />
    </Card>
  );
};

export default InvoicesListResults;
