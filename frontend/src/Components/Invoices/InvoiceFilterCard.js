import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  SvgIcon,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Search as SearchIcon } from "../icons/search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const InvoiceFilterCard = () => {
  const [issuedFromDate, setIssuedFromDate] = useState();
  const [issuedToDate, setIssuedToDate] = useState();
  return (
    <Card>
      <CardContent style={{ padding: "25px", backgroundColor: "#ffffff" }}>
        <Box sx={{ display: "flex", width: "100%",alignItems:"center",justifyContent:"space-between" }}>
          <Box
            sx={{
              width: "90%",
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
              focused
              size="small"
              placeholder="Invoice Number"
              variant="outlined"
              //   onChange={handleSearchChange}
            />

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
              focused
              size="small"
              placeholder="Customer Name"
              variant="outlined"
              
              //   onChange={handleSearchChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Issued From"
                value={issuedFromDate}
                onChange={(newValue) => setIssuedFromDate(newValue)}
                renderInput={(params) => <TextField {...params} focused size="small" />}
              />
              <DateTimePicker
                label="Issued To"
                value={issuedToDate}
                onChange={(newValue) => setIssuedToDate(newValue)}
                renderInput={(params) => <TextField {...params} focused size="small" />}
              />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", width: "10%" }}>
            <Button
              size="large"
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
  );
};

export default InvoiceFilterCard;
