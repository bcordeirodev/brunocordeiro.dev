"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
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
  // o chunk do apexcharts só é buscado/avaliado quando o card entra na
  // viewport — fora do caminho crítico do LCP/TBT (gate 0.85 da home).
  // margin positiva pré-carrega um pouco antes de aparecer.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

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
    <div ref={ref} role="img" aria-label={label} className="min-h-[72px]">
      {inView ? (
        <ReactApexChart
          options={options}
          series={[{ name: label, data: values }]}
          type="area"
          height={72}
          width="100%"
        />
      ) : null}
    </div>
  );
}
