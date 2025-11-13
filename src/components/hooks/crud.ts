import axios from "axios";
import { requestConfig } from "./requestConfig";

export const useCrudFunc = () => {
  const postData = async (url: string, payload: any, cusHeader?: any) => {
    try {
      const res = await axios.post(
        `http://localhost:7002/api/${url}`,
        payload,
        requestConfig(null, cusHeader)
      );
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  const fetchData = async (url: string, params?: any, cusHeader?: any) => {
    try {
      const res = await axios.get(
        `http://localhost:7002/api/${url}`,
        requestConfig(params, cusHeader)
      );
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  const patchData = async (url: string, payload: any, cusHeader?: any) => {
    const res = await axios.patch(
      `http://localhost:7002/api/${url}`,
      payload,
      requestConfig(null, cusHeader)
    );
    return res;
  };

  const updateData = async (url: string, payload: any, cusHeader?: any) => {
    const res = await axios.put(
      `http://localhost:7002/api/${url}`,
      payload,
      requestConfig(null, cusHeader)
    );
    return res;
  };

  return [postData, updateData, patchData, fetchData] as const;
};
