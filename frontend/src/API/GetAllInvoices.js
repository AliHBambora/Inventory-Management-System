import axios from "axios";
import app_constants from "../constants/constants";

export const getAllInvoices = async () => {
  const res = await axios({
    url: app_constants.API_URL + "api/Invoices/GetAllInvoices",
    method: "GET",
    headers: {
      Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
    },
  });
  if (res.data.status == "Success") {
    console.log(res.data);
    return {status:"success",data:res.data.result};
    //setInvoices(res.data.result);
  } else {
    return {status:"failed",Message:res.data.Message};
  }
};
