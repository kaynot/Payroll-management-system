import axios from "axios";
import { requestConfig } from "./requestConfig";

export const GetDataFunc = async (url: string, params?: any) => {
  if (!url) {
    return { data: [] };
  }

  try {
    // Ensure no leading slash in url
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;

    // Make the GET request
    const response = await axios.get(
      `http://localhost:7002/api/${cleanUrl}`,
      requestConfig(params)
    );

    // Return only the actual data from the API
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [] }; // return empty array for table fallback
  }
};
