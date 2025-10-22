import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Radius } from "lucide-react";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Chart data
export function getDonutData() {
  return {
    labels: ["Engineering", "HR", "Marketing", "Operations", "Sales"],
    datasets: [
      {
        label: "Salary breakdown by department",
        data: [40, 15, 20, 10, 15],
        backgroundColor: [
          "#4F46E5", // Indigo 600
          "#818CF8", // Indigo 400
          "#F97316", // Orange 500
          "#FDBA74", // Orange 300
          "#3B82F6", // Blue 500
        ],
        borderColor: "#fff",
        borderWidth: 4,
        cutout: "65%",
        hoverOffset: 20,
      },
    ],
  };
}

export function getDonutOptions() {
  return {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
        },
      },
    },
    maintainAspectRatio: false,
  };
}

const DepartmentDonutChart = () => {
  const data = getDonutData();
  const options = getDonutOptions();

  return (
    <div className="w-full max-w-sm h-[340px]">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DepartmentDonutChart;
