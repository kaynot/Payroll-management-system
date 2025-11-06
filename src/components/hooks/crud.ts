import axios from "axios";
import { requestConfig } from "./requestConfig";

export const useCrudFunc = () => {
  const postData = async (
    url: string,
    payload: any,
    FormAction?: string,
    customFormCode?: string,
    cusHeader?: any
  ) => {
    const response = await axios.post(
      `http://localhost:7002/api/${url}`,
      {
        ...payload,
      },
      requestConfig(null, cusHeader)
    );
    return response;
  };

  const updateData = async (
    url: string,
    payload: any,
    FormAction?: string,
    customFormCode?: string,
    cusHeader?: any
  ) => {
    const response = await axios.put(
      `http://localhost:7002/api/${url}`,
      {
        ...payload,
      },
      requestConfig(null, cusHeader)
    );
    return response;
  };

  const deleteData = async (url: string, payload: any, FormAction?: string) => {
    const response = await axios.delete(`http://localhost:7002/api/${url}`, {
      ...payload,
    });
    return response;
  };

  const patchData = async (url: string, payload: any, FormAction?: string) => {
    const response = await axios.patch(
      `http://localhost:7002/api/${url}`,
      { ...payload },
      requestConfig()
    );
    return response;
  };
  const fetchData = async (url: string) => {
    const response = await axios.get(
      `http://localhost:7002/api/${url}`,
      requestConfig()
    );
    return response;
  };

  return [postData, updateData, patchData, fetchData, deleteData];
};
