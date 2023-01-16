import axios from "axios";
import app_constants from "../constants/constants";


const headers = {
    Authorization: app_constants.BEARER.concat(sessionStorage.getItem(app_constants.TOKEN))
}; 
  
export class APIRequest {
     
  static async get(endpoint) {
    const res = await axios({
      url: app_constants.API_URL + endpoint,
      method: app_constants.GET,
      headers: headers,
    });
    if (res.data.status === app_constants.SUCCESS) {
      console.log(res.data);
      return { status: app_constants.SUCCESS, data: res.data.result };
    } else {
      return { status: app_constants.FAILED, Message: res.data.Message };
    }
  }

  static async post(endpoint, body) {
    const res = await axios({
      url: app_constants.API_URL + endpoint,
      method: app_constants.POST,
      headers: headers,
      data: body,
    });
    if (res.data.status === app_constants.SUCCESS) {
      console.log(res.data);
      return { status: app_constants.SUCCESS, data: res.data.result };
    } else {
      return { status: app_constants.FAILED, Message: res.data.Message };
    }
  }
}
