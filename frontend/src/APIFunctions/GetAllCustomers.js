import axios from "axios";
import app_constants from "../constants/constants";

export const getAllCustomers = async () => {
  const res = await axios({
    url: app_constants.API_URL + "api/Customers/GetAllCustomers",
    method: "GET",
    headers: {
      Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
    },
  });
  if (res.data.status == "Success") {
    console.log(res.data);
    return { status: "success", data: res.data.result };
    //setCustomers(res.data.result);
  } else {
    return { status: "failed", Message: res.data.Message };
  }
};
