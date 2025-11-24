import { useEffect, useState, useCallback } from "react";
import { GetDataFunc } from "./getFunc";

const useFetch = (
  route: string,
  refresh?: string | number | boolean,
  params?: any
): [any, any, boolean, () => void] => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GetDataFunc(`${route}`, params ?? "");

      const responseData =
        res?.data?.data !== undefined ? res.data.data : res?.data;

      // Accept both objects or arrays
      setData(responseData ?? null);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [route, params]);

  useEffect(() => {
    if (!route) {
      setData(null);
    } else {
      fetchData();
    }
  }, [route, refresh, fetchData]);

  return [data, error, loading, fetchData];
};

export default useFetch;
