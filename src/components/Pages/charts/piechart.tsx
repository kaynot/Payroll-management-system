import React, { useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  type ChartOptions,
  type ChartData,
  type ActiveElement,
} from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Legend);

// Chart data
export function getDonutData(): ChartData<"doughnut"> {
  return {
    labels: ["Engineering", "HR", "Marketing", "Operations", "Sales"],
    datasets: [
      {
        label: "Salary breakdown by department",
        data: [40, 15, 20, 10, 15],
        backgroundColor: [
          "#4F46E5",
          "#818CF8",
          "#F97316",
          "#FDBA74",
          "#3B82F6",
        ],
        borderColor: "#fff",
        borderWidth: 4,
        hoverOffset: 20,
      },
    ],
  };
}

// Chart options
export function getDonutOptions(): ChartOptions<"doughnut"> {
  return {
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
        },
      },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false,
  };
}

// Custom plugin that dynamically reads active element
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart: any) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const activeElements: ActiveElement[] = chart.getActiveElements();
    if (activeElements.length > 0) {
      const index = activeElements[0].index;
      const value = chart.data.datasets[0].data[index] as number;
      const label = chart.data.labels[index] as string;

      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#4F46E5";
      ctx.fillText(label, width / 2, height / 2 - 14);

      ctx.font = "bold 24px sans-serif";
      ctx.fillText(value.toString(), width / 2, height / 2 + 10);
    }
    // else do nothing—no text when not hovering

    ctx.restore();
  },
};

const DepartmentDonutChart = () => {
  const chartRef = useRef<ChartJS<"doughnut", number[], unknown>>(null);

  const data = getDonutData();
  const options = getDonutOptions();

  return (
    <div className="w-full max-w-sm h-[340px]">
      <Doughnut
        ref={chartRef}
        data={data}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  );
};

export default DepartmentDonutChart;
