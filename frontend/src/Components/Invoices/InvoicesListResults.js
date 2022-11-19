import React, { useContext, useEffect, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@mui/icons-material/Add";
import { Search as SearchIcon } from "../icons/search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
import {Outlet,Link} from "react-router-dom";
import { DataContext } from "../Context/DataContext";


const InvoicesListResults = ({ ...rest }) => {
  const [issuedFromDate, setIssuedFromDate] = useState();
  const [issuedToDate, setIssuedToDate] = useState();
  const [tabvalue, setTabValue] = useState("1");
  const {invoices} = useContext(DataContext);
  const newInvoiceRef = useRef(null);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
                newInvoiceRef.current.click();
              }}
            >
              Add Invoice
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: "30px", marginBottom: "30px" }}>
          <Card>
            <CardContent
              style={{ padding: "25px", backgroundColor: "#ffffff" }}
            >
              <Box sx={{ display: "flex", width: "100%" }}>
                <Box
                  sx={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon color="action" fontSize="small">
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Invoice Name"
                    variant="outlined"
                    //   onChange={handleSearchChange}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Issued From"
                      value={issuedFromDate}
                      onChange={(newValue) => setIssuedFromDate(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <DateTimePicker
                      label="Issued To"
                      value={issuedToDate}
                      onChange={(newValue) => setIssuedToDate(newValue)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ display: "flex", width: "20%" }}>
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    sx={{ width: "60%", height: "80%", marginLeft: "auto" }}
                  >
                    Search
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ marginTop: "20px" }}>
            <Card>
              <CardContent style={{ backgroundColor: "#f9fafc" }}>
                {/* Tab structure for type of invoices ie. Pending,Paid */}
                <Box
                  sx={{ width: "100%", typography: "body1", marginTop: "15px" }}
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
                      <InvoiceTable data={invoices} />
                    </TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                  </TabContext>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </PerfectScrollbar>
      <Link to="/createInvoice" ref={newInvoiceRef}/>
      <Outlet />
    </Card>
  );
};

export default InvoicesListResults;
