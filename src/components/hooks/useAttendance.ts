import { useCrudFunc } from "./crud";

export interface AttendanceFetchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchText?: string;
  Status?: string;
  StartDate?: string;
  EndDate?: string;
}

export interface RawAttendanceRecord {
  id: number;
  employeeId: number;
  firstName?: string;
  surname?: string;
  department?: string;
  date: string;              
  checkIn?: string | null; 
  checkOut?: string | null; 
}

export interface AttendanceSummary {
  allTime: any;
  month: any;
  today: any;
  totalEmployees: number;
  presentToday: number;
  lateArrivals: number;
  absent: number;
  absentToday: number;
  onLeave: number;
  attendancePercentage: number;
  workingDays: number;
  overallPresent: number;
  overallAbsent: number;
  overallLeave: number;
  averageAttendancePercentage: number;
  allWorkingDays: number;
  totalPresent: number;
  totalAbsent: number;
  totalLeave: number;
  lifetimeAttendancePercentage: number;
}


export const useAttendance = () => {
  const [postData, updateData, , fetchData] = useCrudFunc();

  // ------------------ Check-In ------------------
  const checkIn = async (payload: any) => {
    const res = await postData("Attendance/CheckIn", payload);
    return res.data; // { message, data, statusCode }
  };

  // ------------------ Check-Out ------------------
  const checkOut = async (payload: any) => {
    const res = await updateData("Attendance/CheckOut", payload);
    return res.data;
  };

  // ------------------ Fetch Attendance ------------------
  const fetchAttendance = async (params: AttendanceFetchParams) => {
    const formattedParams: any = {};

    if (params.PageNumber) formattedParams.PageNumber = params.PageNumber;
    if (params.PageSize) formattedParams.PageSize = params.PageSize;
    if (params.SearchText) formattedParams.SearchText = params.SearchText;
    if (params.StartDate) formattedParams.StartDate = params.StartDate;
    if (params.EndDate) formattedParams.EndDate = params.EndDate;

    // "Status" is optional but only include if it's not "all"
    if (params.Status && params.Status !== "all") {
      formattedParams.Status = params.Status;
    }

    const res = await fetchData("Attendance", formattedParams);
    return res.data; // backend returns {message, data:[], statusCode, totalPages?}
    
  };

  // ------------------ Fetch Summary ------------------
  const fetchSummary = async () => {
    const res = await fetchData("Attendance/summary");
    return res.data; // { message, data:{counts}, statusCode }
  };

  return { checkIn, checkOut, fetchAttendance, fetchSummary };
};
