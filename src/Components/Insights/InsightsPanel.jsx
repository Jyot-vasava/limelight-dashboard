import { useSelector } from "react-redux";
import { detectInsights } from "../../lib/detectInsights.js";
import { useGetStreamQuery } from "../../Features/apiSlice.js";

const Insight = ({ insight }) => {
  const bg =
    insight.severity === "error"
      ? "bg-red-50 border-red-300"
      : insight.severity === "warning"
      ? "bg-yellow-50 border-yellow-300"
      : "bg-blue-50 border-blue-300";
  return (
    <div className={`p-4 rounded-lg border ${bg}`}>
      <div className="font-semibold">{insight.title}</div>
      <div className="text-sm mt-1">{insight.desc}</div>
    </div>
  );
};

export default function InsightsPanel() {
 const { data: points = [] } = useGetStreamQuery();
  const insights = detectInsights(points);

  if (insights.length === 0) return null;

  return (
    <section aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="text-xl font-bold mb-4">
         Insights
      </h2>
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <Insight key={i} insight={ins} />
        ))}
      </div>
    </section>
  );
}
