import { motion } from "framer-motion";
import { BarChart, Clock, Infinity, RefreshCw } from "lucide-react";
import { useAttendance } from "../../context/AttendanceContext";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Today } from "./Attendance/Today";
import { ThisMonth } from "./Attendance/ThisMonth";
import { AllTime } from "./Attendance/AllTime";

export default function Attendance() {
  const { refreshAttendance, loading } = useAttendance();
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col"
    >
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Track and manage employee attendance</p>
        </div>

        <div
          onClick={() => refreshAttendance()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition cursor-pointer"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} />
          <span className="text-sm">Refresh</span>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <Tabs defaultValue="today" className="flex flex-col w-full">
          <TabsList>
            <TabsTrigger value="today" className="w-full gap-2">
              <Clock color="#000000" size={18} />
              Today
            </TabsTrigger>
            <TabsTrigger value="thisMonth" className="w-full gap-2">
              <BarChart color="#000000" size={18} />
              This Month
            </TabsTrigger>
            <TabsTrigger value="allTime" className="w-full gap-2">
              <Infinity color="#000000" size={18} />
              All Time
            </TabsTrigger>
          </TabsList>
          {/* Today */}
          <TabsContent value="today">
            <Today />
          </TabsContent>

          {/* This Month */}
          <TabsContent value="thisMonth">
            <ThisMonth />
          </TabsContent>

          {/* All Time */}
          <TabsContent value="allTime">
            <AllTime />
          </TabsContent>
        </Tabs>
      </section>
    </motion.main>
  );
}
