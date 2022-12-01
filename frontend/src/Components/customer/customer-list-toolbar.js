import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../icons/search";
import { Upload as UploadIcon } from "../icons/upload";
import { Download as DownloadIcon } from "../icons/download";

import { useState } from "react";
import app_constants from "../../constants/constants";
import AddIcon from '@mui/icons-material/Add';

export const CustomerListToolbar = (props) => {
  
  const [customers,setCustomers] = useState(props.customers); 
  // const handleChange = (e)=>{
  //   console.log(props.customers);
  //   var result  = props.customers.filter(x=>x.name.toLowerCase().includes(e.target.value));
  //   props.setCustomersValue(result);
  // }
  return (
    <Box {...props}>
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
          Customers
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button startIcon={<UploadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Import
          </Button>
          <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
            Export
          </Button>
          <Button endIcon={<AddIcon />} color="primary" variant="contained">
            Add Customers
          </Button>
        </Box>
      </Box>
      {/* <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
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
                onChange={handleChange}
              />
            </Box>
          </CardContent>
        </Card>
      </Box> */}

      
    </Box>
  );
};
