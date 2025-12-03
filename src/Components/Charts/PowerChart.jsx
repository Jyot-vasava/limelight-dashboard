// src/components/charts/PowerChart.jsx
import { useEffect, useRef, useState } from "react";
import { useGetStreamQuery } from "../../Features/apiSlice";
import uPlot from "uplot";
import "uplot/dist/uPlot.min.css";

export default function PowerChart() {
  const chartRef = useRef(null);
  const { data: points = [] } = useGetStreamQuery();
  const [uplotInstance, setUplotInstance] = useState(null);

  useEffect(() => {
    if (points.length < 10 || !chartRef.current) return;

    const timestamps = points.map((p) => p.ts / 1000);
    const kw = points.map((p) => p.kw);
    const stateValues = points.map((p) =>
      p.state === "RUN" ? 2 : p.state === "IDLE" ? 1 : 0
    );

    const data = [timestamps, kw, stateValues];

    const opts = {
      width: chartRef.current.clientWidth,
      height: 380,
      series: [
        {},
        {
          label: "Power (kW)",
          stroke: "#10b981",
          width: 2,
        },
        {
          label: "State",
          fill: "rgba(251, 191, 36, 0.3)",
          points: { show: false },
          value: (u, v) => (v === 2 ? "RUN" : v === 1 ? "IDLE" : "OFF"),
        },
      ],
      axes: [
        { grid: { show: false } },
        { label: "kW", stroke: "#10b981" },
        { side: 1, label: "State", gaps: () => null },
      ],
      scales: { x: { time: true } },
      legend: { show: true },
    };

    const u = new uPlot(opts, data, chartRef.current);
    setUplotInstance(u);

    const handleResize = () => {
      if (uplotInstance && chartRef.current) {
        uplotInstance.setSize({
          width: chartRef.current.clientWidth,
          height: 380,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      uplotInstance?.destroy();
    };
  }, [points]);

  return (
    <section
      aria-labelledby="power-heading"
      className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
    >
      <h2 id="power-heading" className="text-lg font-semibold p-4 border-b">
        Power Trend + Machine State
      </h2>
      <div ref={chartRef} className="h-96" />
    </section>
  );
}
