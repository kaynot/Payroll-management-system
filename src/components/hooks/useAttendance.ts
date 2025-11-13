import { useCrudFunc } from "./crud";

export const useAttendance = () => {
  const [postData, updateData] = useCrudFunc();

  const checkIn = async (payload: any) => {
    try {
      const res = await postData("Attendance/checkin", payload);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const checkOut = async (payload: any) => {
    try {
      const res = await updateData("Attendance/checkout", payload);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return { checkIn, checkOut };
};
