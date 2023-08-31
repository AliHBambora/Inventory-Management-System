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

const headers = {
  Authorization: "Bearer ".concat(sessionStorage.getItem("token")),
};

export class APIFunction {
  static async get(endpoint) {
    const res = await axios({
      url: app_constants.API_URL + endpoint,
      method: app_constants.GET,
      headers: headers,
    });
    if (res.data.status === "success") {
      console.log(res.data);
      return { status: "success", data: res.data.data };
    } else {
      return { status: "failed", Message: res.data.Message };
    }
  }

  static async post(endpoint, formdata) {
    const res = await axios({
      url: app_constants.API_URL + endpoint,
      method: app_constants.POST,
      headers: headers,
      data: formdata,
    });
    if (res.data.status === "success") {
      console.log(res.data);
      return { status: app_constants.SUCCESS, data: res.data.result };
    } else {
      return { status: app_constants.FAILED, Message: res.data.Message };
    }
  }
}
