import { Box, Container, Grid } from '@mui/material';
import { useContext, useEffect } from 'react';
import {getAllCustomers} from '../../API/GetAllCustomers';
import {getAllInvoices} from '../../API/GetAllInvoices';
import {getAllProducts} from '../../API/GetAllProducts';
import { DataContext } from '../Context/DataContext';
import { Budget } from '../dashboard/budget';
import {Sales} from '../dashboard/sales';
// import { Budget } from '../components/dashboard/budget';
import { LatestOrders } from '../dashboard/latest-orders';
import { LatestProducts } from '../dashboard/latest-products';
import { TasksProgress } from '../dashboard/tasks-progress';
import { TotalCustomers } from '../dashboard/total-customers';
import { TotalProfit } from '../dashboard/total-profit';
import { TrafficByDevice } from '../dashboard/traffic-by-device';
import { DashboardLayout } from '../dashboard-layout';

const Dashboard = () => {

  // const getAllCustomers = async ()=>{
  //   const res = await axios({
  //     url:app_constants.API_URL + "api/Customers/GetAllCustomers",
  //     method:"GET",
  //     headers: {
  //       Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
  //     }
  //   });
  //   if(res.data.status=="Success"){
  //     console.log(res.data);
  //     setCustomers(res.data.result);
  //   }
  //   else{
  //     Swal.fire({
  //       icon:"error",
  //       title:"Error occured while fetching the list of Customers",
  //       text:res.data.Message
  //     });
  //   }
  // }

  // const getAllProducts = async ()=>{
  //   const res = await axios({
  //     url:app_constants.API_URL + "api/Products/GetAllProducts",
  //     method:"GET",
  //     headers: {
  //       Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
  //     }
  //   });
  //   if(res.data.status=="Success"){
  //     setProducts(res.data.result);
  //   }
  //   else{
  //     Swal.fire({
  //       icon:"error",
  //       title:"Error occured while fetching the list of Customers",
  //       text:res.data.Message
  //     });
  //   }
  // }

  // const getAllInvoices = async ()=>{
  //   const res = await axios({
  //     url:app_constants.API_URL + "api/Invoices/GetAllInvoices",
  //     method:"GET",
  //     headers: {
  //       Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
  //     }
  //   });
  //   if(res.data.status=="Success"){
  //     console.log(res.data);
  //     setInvoices(res.data.result);
  //   }
  //   else{
  //     Swal.fire({
  //       icon:"error",
  //       title:"Error occured while fetching the list of Customers",
  //       text:res.data.Message
  //     });
  //   }
  // }



  return(
  <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            xl={3}
            lg={3}
            sm={6}
            xs={12}
          >
            <TotalProfit sx={{ height: '100%' }} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice sx={{ height: '100%' }} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts sx={{ height: '100%' }} />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)};

Dashboard.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Dashboard;
