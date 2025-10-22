import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "January", "monthly trends": 2400, amount: 2400 },
  { name: "February", "monthly trends": 7398, amount: 2210 },
  { name: "March", "monthly trends": 9800, amount: 2290 },
  { name: "April", "monthly trends": 3908, amount: 2000 },
  { name: "May", "monthly trends": 4800, amount: 2181 },
  { name: "June", "monthly trends": 3800, amount: 2500 },
  { name: "July", "monthly trends": 4300, amount: 2100 },
];

const StackedBarChart = () => {
  return (
    <div className="w-full h-[350px] max-w-3xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="monthly trends"
            stackId="a"
            fill="#4F46E5"
            barSize={80}
            radius={[10, 10, 0, 0]}
          />
          {/* Indigo 500 */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
