import React from 'react'

export const Attendance = () => {
  return (
    <div>
  
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
          <p className="text-gray-500">
            Track and manage employee attendance
          </p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
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

        {/* On Leave */}
        <div className="bg-white shadow-sm border rounded-xl p-4">
          <h2 className="text-gray-700 font-semibold mb-2">On Leave</h2>
          <p className="text-3xl font-bold text-blue-500">3</p>
          <p className="text-gray-500 text-sm">Approved leave</p>
        </div>
      </div>
    </div>
  



  </div>
  )
}

