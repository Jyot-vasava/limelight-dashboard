import { useSelector } from "react-redux";
import { useGetStreamQuery } from "../../Features/apiSlice.js";

export default function ThroughputSpark() {
  const { data: points = [] } = useGetStreamQuery();
  if (points.length < 60) return null;

  const recent = points.slice(-60);
  const delta = recent[recent.length - 1].count_total - recent[0].count_total;
  const rate = (delta * 60).toFixed(1);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-3">Throughput (last 60 sec)</h2>
      <div className="text-5xl font-bold text-pink-600">{rate}</div>
      <div className="text-sm text-gray-500">units/min</div>
    </section>
  );
}
