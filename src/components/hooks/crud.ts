import axios from "axios";
import { requestConfig } from "./requestConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useCrudFunc = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Helper to get headers including token
  const getHeaders = (cusHeader?: any) => {
    if (!token) {
      console.warn("No token found. Redirecting to login.");
      navigate("/", { replace: true });
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      ...cusHeader,
    };
  };

  const postData = async (url: string, payload: any, cusHeader?: any) => {
    try {
      const res = await axios.post(
        `http://localhost:7002/api/${url}`,
        payload,
        requestConfig(null, getHeaders(cusHeader))
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
        requestConfig(params, getHeaders(cusHeader))
      );
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  const patchData = async (url: string, payload: any, cusHeader?: any) => {
    try {
      const res = await axios.patch(
        `http://localhost:7002/api/${url}`,
        payload,
        requestConfig(null, getHeaders(cusHeader))
      );
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  const updateData = async (url: string, payload: any, cusHeader?: any) => {
    try {
      const res = await axios.put(
        `http://localhost:7002/api/${url}`,
        payload,
        requestConfig(null, getHeaders(cusHeader))
      );
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  return [postData, updateData, patchData, fetchData] as const;
};
