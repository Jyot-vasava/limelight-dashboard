    import { useSelector } from "react-redux";
    import { calculateKPIs } from "../../lib/calculateKPIs.js";
    import { useGetStreamQuery } from "../../Features/apiSlice.js";

    const KpiCard = ({ label, value, unit, color = "blue" }) => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </div>
        <div
          className={`mt-2 text-3xl font-bold text-${color}-600 dark:text-${color}-400`}
        >
          {value} <span className="text-lg font-normal">{unit}</span>
        </div>
      </div>
    );

    export default function KpiGrid() {
      const { data: points = [] } = useGetStreamQuery();
      const windowMin = useSelector((state) => state.ui.windowMinutes);
      const kpis = calculateKPIs(points, windowMin);

      if (!kpis)
        return <div className="text-center py-10">Waiting for data...</div>;

      return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <KpiCard label="Uptime" value={`${kpis.uptime}%`} color="green" />
          <KpiCard label="Idle" value={`${kpis.idle}%`} color="yellow" />
          <KpiCard label="Off" value={`${kpis.off}%`} color="red" />
          <KpiCard
            label="Avg Power"
            value={kpis.avgKw}
            unit="kW"
            color="emerald"
          />
          <KpiCard
            label="Energy Used"
            value={kpis.energyKwh}
            unit="kWh"
            color="indigo"
          />
          <KpiCard label="Avg PF" value={kpis.avgPf} color="purple" />
          <KpiCard
            label="Throughput"
            value={kpis.throughput}
            unit="units/min"
            color="pink"
          />
          <KpiCard
            label="Phase Imbalance"
            value={`${kpis.imbalance}%`}
            color={kpis.imbalance > 15 ? "red" : "green"}
          />
        </div>
      );
    }