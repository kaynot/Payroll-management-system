
import { useState } from "react";
import { format } from "date-fns";

export const Attendance = () => {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const attendanceData = [
    { id: 1, name: "Anita Osei", department: "Finance", date: "2025-10-29", checkIn: "08:40 AM", checkOut: "05:00 PM", status: "Present" },
    { id: 2, name: "NanaYaw", department: "IT", date: "2025-10-29", checkIn: "09:25 AM", checkOut: "05:00 PM", status: "Late" },
    { id: 3, name: "King Amoah", department: "HR", date: "2025-10-29", checkIn: "--", checkOut: "--", status: "Absent" },
    { id: 4, name: "Esther Yaa Asantewaa", department: "Marketing", date: "2025-10-29", checkIn: "08:55 AM", checkOut: "05:10 PM", status: "Present" },
  ];

  const filteredData = attendanceData.filter(
    (record) =>
      record.name.toLowerCase().includes(search.toLowerCase()) &&
      record.date === selectedDate
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Late":
        return "bg-yellow-100 text-yellow-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ======= HEADER ======= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
          <p className="text-gray-500">Track and manage employee attendance</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100">
            <i className="fa fa-download"></i>
            Export
          </button>

          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            <i className="fa fa-upload"></i>
            Import Excel
          </button>
        </div>
      </div>

      {/* ======= STAT CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Present */}
        <div className="bg-white shadow-sm border rounded-xl p-4">
          <h2 className="text-gray-700 font-semibold mb-2">Present Today</h2>
          <p className="text-3xl font-bold text-green-600">85</p>
          <p className="text-gray-500 text-sm">Out of 100 employees</p>
        </div>

        {/* Late Arrivals */}
        <div className="bg-white shadow-sm border rounded-xl p-4">
          <h2 className="text-gray-700 font-semibold mb-2">Late Arrivals</h2>
          <p className="text-3xl font-bold text-yellow-500">8</p>
          <p className="text-gray-500 text-sm">After 9:00 AM</p>
        </div>

        {/* Absent */}
        <div className="bg-white shadow-sm border rounded-xl p-4">
          <h2 className="text-gray-700 font-semibold mb-2">Absent</h2>
          <p className="text-3xl font-bold text-red-500">4</p>
          <p className="text-gray-500 text-sm">Unexcused absences</p>
        </div>
        <div className="bg-white shadow-sm border rounded-xl p-4">
          <h2 className="text-gray-700 font-semibold mb-2">On Leave</h2>
          <p className="text-3xl font-bold text-blue-500">3</p>
          <p className="text-gray-500 text-sm">Approved leave</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Today's Attendance</h2>
          <p className="text-gray-500">
            {format(new Date(selectedDate), "MMMM dd, yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <div className="bg-white shadow-sm border rounded-xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-3 border-b">Employee Name</th>
              <th className="text-left px-4 py-3 border-b">Department</th>
              <th className="text-left px-4 py-3 border-b">Date</th>
              <th className="text-left px-4 py-3 border-b">Check-In</th>
              <th className="text-left px-4 py-3 border-b">Check-Out</th>
              <th className="text-left px-4 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{record.name}</td>
                <td className="px-4 py-3">{record.department}</td>
                <td className="px-4 py-3">{record.date}</td>
                <td className="px-4 py-3">{record.checkIn}</td>
                <td className="px-4 py-3">{record.checkOut}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
