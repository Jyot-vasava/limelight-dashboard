import { useSelector } from "react-redux";

export default function GapBadge() {
  const hasGap = useSelector((s) => s.ui.hasGap);
  if (hasGap) return null;

  return (
    <div className="animate-pulse bg-gray-400 text-black px-4 py-2 rounded-full text-sm font-bold">
      No data &gt; 10s  {/* &gt; for > */}
    </div>
  );
}
