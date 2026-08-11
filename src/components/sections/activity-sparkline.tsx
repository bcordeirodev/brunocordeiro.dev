"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import type { ApexOptions } from "apexcharts";

// ApexCharts só roda no browser — carregado fora do bundle inicial e sem SSR.
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function ActivitySparkline({
  categories,
  values,
  label,
}: {
  categories: string[];
  values: number[];
  label: string;
}) {
  const reduced = useReducedMotion() ?? false;

  const options: ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: !reduced },
      foreColor: "#a1a1aa",
      parentHeightOffset: 0,
    },
    colors: ["#3fdd78"],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.3, opacityTo: 0.02 },
    },
    dataLabels: { enabled: false },
    xaxis: { categories },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: { formatter: (value) => `${value}` },
    },
  };

  return (
    <div role="img" aria-label={label}>
      <ReactApexChart
        options={options}
        series={[{ name: label, data: values }]}
        type="area"
        height={72}
        width="100%"
      />
    </div>
  );
}
