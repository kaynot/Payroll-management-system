import React, { useRef, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// demo data
const data = [
  { name: "January", value: 2400 },
  { name: "February", value: 7398 },
  { name: "March", value: 9800 },
  { name: "April", value: 3908 },
  { name: "May", value: 4800 },
  { name: "June", value: 3800 },
  { name: "July", value: 4300 },
];

// --- Hook that observes actual pixel dimensions ---
function useMeasure() {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBounds({ width, height });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, bounds] as const;
}

const StackedBarChart = () => {
  const [ref, { width, height }] = useMeasure();

  return (
    <div
      ref={ref}
      className="w-full h-[350px] max-w-3xl rounded-xl bg-white dark:bg-card shadow-sm border p-4"
    >
      {/* Render nothing until actual height/width exist */}
      {width > 0 && height > 0 && (
        <BarChart
          width={width}
          height={height - 20} // padding for header
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: -20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
          <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
          <Tooltip cursor={{ fill: "rgba(79, 70, 229, 0.05)" }} />
          <Legend />
          <Bar
            dataKey="value"
            fill="#4F46E5" // same indigo theme
            radius={[8, 8, 0, 0]} // smooth rounded top
            maxBarSize={60}
          />
        </BarChart>
      )}
    </div>
  );
};

export default StackedBarChart;
