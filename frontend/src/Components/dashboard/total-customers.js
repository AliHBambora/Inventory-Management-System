import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../Context/DataContext";
import { APIFunction } from "../../APIFunctions/GetAllCustomers";

export const TotalCustomers = (props) => {
  const [totalCustomerCount, setTotalCustomerCount] = useState(0);
  const { setShowToast, setToastType, setToastMessage } =
    useContext(DataContext);

  useEffect(() => {
    APIFunction.get("api/Customers/GetCustomersCount").then((res) => {
      if (res.status == "success") {
        setTotalCustomerCount(res.data);
      } else {
        setShowToast(true);
        setToastType("error");
        setToastMessage(res.Message);
      }
    });
  }, []);
  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              TOTAL CUSTOMERS
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {totalCustomerCount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "success.main",
                height: 56,
                width: 56,
              }}
            >
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            pt: 2,
          }}
        >
          <ArrowUpwardIcon color="success" />
          <Typography
            variant="body2"
            sx={{
              mr: 1,
            }}
          >
            16%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
