import { requestConfig } from "./requestConfig";
import axios from "axios";

export const PostDataFunc = async (url: string, payload: any) => {
  const postResponse = await axios.post(
    `https://localhost:7002/api/${url}`,
    payload,
    requestConfig()
  );
  return postResponse;
};
