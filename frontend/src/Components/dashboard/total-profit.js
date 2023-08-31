import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { APIFunction } from "../../APIFunctions/GetAllCustomers";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../Context/DataContext";

export const TotalProfit = (props) => {
  const [profit, setProfit] = useState(0);
  const { setShowToast, setToastType, setToastMessage } =
    useContext(DataContext);
  useEffect(() => {
    APIFunction.get("api/Invoices/GetThisMonthProfit").then((res) => {
      if (res.status == "success") {
        setProfit(res.data);
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
              TOTAL PROFIT
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {profit} KD
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: "primary.main",
                height: 56,
                width: 56,
              }}
            >
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <ArrowDownwardIcon color="error" /> */}
          {/* <Typography
            color="error"
            sx={{
              mr: 1,
            }}
            variant="body2"
          >
            12%
          </Typography> */}
          <Typography color="textSecondary" variant="body2">
            This Month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
