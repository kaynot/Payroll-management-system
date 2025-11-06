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
    // dispatch(setGeneralValue({ expr: "formData", value: [] })); //clear form data from redux general store
    try {
      setLoading(true); // initially set loading state
      // get data
      const res = await GetDataFunc(`${route}`, params ?? "");
      if (res?.data?.data) {
        if (Array.isArray(res?.data?.data)) {
          const newArray = res?.data?.data?.map((obj: any) => ({
            ...obj,
            id: generateRandomId(),
          }));
          setData(newArray);
        } else {
          const newArray = res?.data?.data?.data?.map((obj: any) => ({
            ...obj,
            id: generateRandomId(),
          }));
          setData(newArray);
        }
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false); //loading state to false
    }
  };

  return [data, error, loading];
};
export default useFetch;
