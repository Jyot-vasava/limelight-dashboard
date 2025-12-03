import { useDispatch, useSelector } from "react-redux";
import { setWindowMinutes } from "../../Features/uiSlice";

export default function WindowSelector() {
  const dispatch = useDispatch();
  const current = useSelector((s) => s.ui.windowMinutes);

  return (
    <select
      value={current}
      onChange={(e) => dispatch(setWindowMinutes(Number(e.target.value)))}
      className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
    >
      <option value={5}>Last 5 min</option>
      <option value={15}>Last 15 min</option>
      <option value={30}>Last 30 min</option>
    </select>
  );
}
