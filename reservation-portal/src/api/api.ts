import axios from "axios";
import { config } from "../config";
export const makeBooking = (params: any) => {
  try {
    const res = axios.post(config.api.makeBookingURL, params);
  } catch (e) {}
};

export const getBookingInfo = (params:any) => {
  try {
    const res = axios.post(config.api.getBookingInfoURL, params);
  } catch (e) {}
};
export const cancelBooking = (params:any) => {
    try {
      const res = axios.post(config.api.cancelBookingURL, params);
    } catch (e) {}
  };