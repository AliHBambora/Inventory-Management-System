import { useContext, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "../../styles/customer-list-results.module.css";
import { Upload as UploadIcon } from "../icons/upload";
import { Download as DownloadIcon } from "../icons/download";
import AddIcon from "@mui/icons-material/Add";

import { format } from "date-fns";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  InputAdornment,
  Modal,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { getInitials } from "../utils/get-initials";
import { Search as SearchIcon } from "../icons/search";
import axios from "axios";
import app_constants from "../../constants/constants";
import Swal from "sweetalert2";
import { DataContext } from "../Context/DataContext";
import AddCustomerModal from "../modals/AddCustomerModal";
import { GetCustomer } from "../../APIFunctions/GetCustomer";

export const CustomerListResults = ({
  // customers,
  refreshcustomers,
  ...rest
}) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [currCustomerID, setCurrCustomerID] = useState("");
  const [openAddNewCustomer, setOpenAddNewCustomer] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const {customers} = useContext(DataContext);

  useEffect(() => {
    setDisplayedCustomers(customers);
  }, [customers]);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds,
        id
      );
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(1)
      );
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    if (e.target.value == "") {
      setDisplayedCustomers(customers);
    } else {
      var result = customers.filter((x) =>
        x.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setDisplayedCustomers(result);
    }

    // props.setCustomersValue(result);
  };

  const CloseModal = () => {
    setOpenAddNewCustomer(false);
    setIsEdit(false);
  };

  //API Functions

 
  const DeleteCustomer = async (id) => {
    const res = await axios({
      url: app_constants.API_URL + `api/Customers/DeleteCustomer?ID=${id}`,
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
      },
    });
    if (res.data.status == "Success") {
      Swal.fire({
        icon: "success",
        title: "Customer successfully deleted",
      });
      refreshcustomers();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error occured while deleting customer",
        text: res.data.message,
      });
    }
  };

  

  return (
    <Card {...rest} >
      <PerfectScrollbar>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            m: -1,
            background: "#f9fafc",
          }}
        >
          <Typography sx={{ m: 1 }} variant="h4">
            Customers
          </Typography>
          <Box sx={{ m: 1 }}>
            <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
              Import
            </Button>
            <Button
              startIcon={<DownloadIcon fontSize="small" />}
              sx={{ mr: 1 }}
            >
              Export
            </Button>
            <Button
              endIcon={<AddIcon />}
              color="primary"
              variant="contained"
              onClick={() => {
                setOpenAddNewCustomer(true);
              }}
            >
              Add Customers
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop:"30px",marginBottom:"30px" }}>
          <Card>
            <CardContent style={{ padding: "15px", borderRadius: "10px" }}>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action" fontSize="small">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search customer"
                  variant="outlined"
                  onChange={handleSearchChange}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0 &&
                      selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                {/* <TableCell>
                  Email
                </TableCell> */}
                <TableCell>Address</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedCustomers?.slice(0, limit).map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                  selected={selectedCustomerIds.indexOf(customer.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar
                        src={customer.avatarUrl}
                        sx={{ mr: 2, background: "#2e3e7c" }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {customer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>{customer.phoneNo}</TableCell>
                  <TableCell>{customer.description}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setIsEdit(true);
                          setOpenAddNewCustomer(true);
                          setCurrCustomerID(customer.customerId);
                        }}
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
                              DeleteCustomer(customer.id);
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
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Add new Customer Modal */}
     <AddCustomerModal open={openAddNewCustomer} CloseModal={CloseModal} isEdit={isEdit} currCustomerID={currCustomerID}/>
    </Card>
  );
};

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
