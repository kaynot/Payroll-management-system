import { useEffect, useState } from "react";
import { GetDataFunc } from "./getFunc";

const useFetch = (
  route: string,
  refresh?: string | number | boolean,
  params?: any
): [any, any, boolean] => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>("");

  useEffect(() => {
    !route ? setData([]) : fetchData();
  }, [route, refresh]);

  // Function to generate a random ID
  function generateRandomId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomText = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomText += characters[randomIndex];
    }

    return randomText;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await GetDataFunc(`${route}`, params ?? "");

      // Expecting backend response: { message: string, data: array }
      if (res?.data && Array.isArray(res.data)) {
        setData(res.data);
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return [data, error, loading];
};
export default useFetch;
