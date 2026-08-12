"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { ApexOptions } from "apexcharts";

// ApexCharts só roda no browser — carregado fora do bundle inicial e sem SSR
// (mesmo padrão do activity-sparkline).
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function GrafanaBars({
  categories,
  values,
  label,
}: {
  categories: string[];
  values: number[];
  label: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: !reduced },
      foreColor: "#8e8e9a",
      parentHeightOffset: 0,
    },
    colors: ["#73bf69"],
    plotOptions: { bar: { columnWidth: "60%", borderRadius: 2 } },
    dataLabels: { enabled: false },
    grid: { borderColor: "#2c3235", strokeDashArray: 3 },
    xaxis: { categories, labels: { rotate: -45, style: { fontSize: "10px" } } },
    yaxis: { labels: { style: { fontSize: "10px" } } },
    tooltip: { theme: "dark", y: { formatter: (value) => `${value}` } },
  };

  return (
    <div ref={ref} role="img" aria-label={label} className="min-h-40">
      {inView ? (
        <ReactApexChart
          options={options}
          series={[{ name: label, data: values }]}
          type="bar"
          height={160}
          width="100%"
        />
      ) : null}
    </div>
  );
}
