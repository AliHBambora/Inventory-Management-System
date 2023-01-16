import axios from "axios";
import app_constants from "../constants/constants";

export const getAllProducts = async () => {
  const res = await axios({
    url: app_constants.API_URL + "api/Products/GetAllProducts",
    method: "GET",
    headers: {
      Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
    },
  });
  if (res.data.status == "Success") {
    //setProducts(res.data.result);
    return {status:"success",data:res.data.result}
  } else {
    return {status:"failed",Message:res.data.Message}
  }
};
