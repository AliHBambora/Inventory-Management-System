import axios from "axios";
import Swal from "sweetalert2";
import app_constants from "../constants/constants";

export const GetCustomer = async (id) => {
  const res = await axios({
    url: app_constants.API_URL + `api/Customers/GetCustomer?ID=${id}`,
    method: "GET",
    headers: {
      Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
    },
  });
  if (res.data.status === "Success") {
    console.log(res.data);
    return {status:"success",data:res.data.result}
  } else {
    Swal.fire({
      icon: "error",
      title: "Error occured while fetching details of the customer",
      text: res.data.message,
    });
  }
};
