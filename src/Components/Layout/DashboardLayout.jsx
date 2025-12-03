import KpiGrid from "../KPI/KpiGrid.jsx";
import PowerChart from "../Charts/PowerChart.jsx";
import PhaseCurrentChart from "../Charts/PhaseCurrentChart.jsx";
import ThroughputSpark from "../Charts/ThroughputSpark.jsx";
import InsightsPanel from "../Insights/InsightsPanel.jsx";
import WindowSelector from "../UI/WindowSelector.jsx";
import GapBadge from "../UI/GapBadge.jsx";
import ExportButton from "../UI/ExportButton.jsx";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            LimelightIT — Device Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <WindowSelector />
            <ExportButton />
            <GapBadge />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <KpiGrid />
        <InsightsPanel />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PowerChart />
            <PhaseCurrentChart />
          </div>
          <div className="space-y-6">
            <ThroughputSpark />
          </div>
        </div>
      </main>
    </div>
  );
}
