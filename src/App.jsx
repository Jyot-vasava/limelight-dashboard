import { useGetStreamQuery } from "./Features/apiSlice.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateLastDataTs } from "./Features/uiSlice.js";
import DashboardLayout from "./Components/Layout/DashboardLayout.jsx";

function App() {
  const { data: points = [] } = useGetStreamQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (points.length > 0) {
      dispatch(updateLastDataTs(points[points.length - 1].ts));
    }
  }, [points, dispatch]);

  return <DashboardLayout />;
}

export default App;
