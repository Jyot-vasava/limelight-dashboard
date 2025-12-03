import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import { useGetStreamQuery } from "../../Features/apiSlice.js";

export default function ExportButton() {
  const { data: points = [] } = useGetStreamQuery();

  const exportCSV = () => {
    if (points.length === 0) return;
    const headers = Object.keys(points[0]).join(",");
    const rows = points.map((p) => Object.values(p).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `device_stream_${new Date().toISOString().slice(0, 19)}.csv`);
  };

  return (
    <button
      onClick={exportCSV}
      className="px-4 py-2 bg-gray-400 text-black rounded-lg hover:bg-gray-500"
    >
      Export CSV
    </button>
  );
}
