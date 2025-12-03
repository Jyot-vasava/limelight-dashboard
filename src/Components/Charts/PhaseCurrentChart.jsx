// src/components/charts/PhaseCurrentChart.jsx
import { useEffect, useRef } from "react";
import { useGetStreamQuery } from "../../Features/apiSlice";
import uPlot from "uplot";

export default function PhaseCurrentChart() {
  const ref = useRef(null);
  const { data: points = [] } = useGetStreamQuery();

  useEffect(() => {
    if (points.length < 10 || !ref.current) return;

    const u = new uPlot(
      {
        width: ref.current.clientWidth,
        height: 220,
        series: [
          {},
          { stroke: "#ef4444", label: "IR" },
          { stroke: "#f59e0b", label: "IY" },
          { stroke: "#3b82f6", label: "IB" },
        ],
        legend: { show: true },
        scales: { x: { time: true } },
      },
      [
        points.map((p) => p.ts / 1000),
        points.map((p) => p.ir),
        points.map((p) => p.iy),
        points.map((p) => p.ib),
      ],
      ref.current
    );

    return () => u.destroy();
  }, [points]);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <h2 className="text-lg font-semibold p-4 border-b">Phase Currents (A)</h2>
      <div ref={ref} className="h-56" />
    </section>
  );
}
