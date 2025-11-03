import axios from "axios";
import { requestConfig } from "./requestConfig";

export const GetDataFunc = async (url: string, params?: any) => {
  if (!url) {
    return { data: [] };
  }

  try {
    // Make the GET request using axios
    const getResponse = await axios.get(
      `https://localhost:7002/api/${url}`,
      requestConfig(params)
    );
    // Return the response data
    return getResponse;
  } catch (error) {
    // Handle any errors that might occur during the request
    console.error("Error fetching data:", error);

    // Return an empty data object or handle the error as needed
    return { data: [] };
  }
};
