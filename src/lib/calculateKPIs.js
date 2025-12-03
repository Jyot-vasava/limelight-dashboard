export const calculateKPIs = (points, windowMin = 15) => {
  // DEMO MODE: Return realistic fake KPIs after 1 minute of data
  // if (points.length > 60) {
  //   return {
  //     uptime: "68.4",
  //     idle: "24.1",
  //     off: "7.5",
  //     avgKw: 76.82,
  //     energyKwh: 19.847,
  //     avgPf: 0.918,
  //     throughput: 42.6,
  //     imbalance: 40,
  //   };
  // }

  // REAL PRODUCTION LOGIC BELOW 
  if (points.length < 2) return null;

  const now = Date.now();
  const windowStart = now - windowMin * 60 * 1000;
  const windowPoints = points
    .filter((p) => p.ts >= windowStart)
    .sort((a, b) => a.ts - b.ts);

  if (windowPoints.length < 2) return null;

  let runSec = 0,
    idleSec = 0,
    offSec = 0,
    totalSec = 0,
    kwWeighted = 0;

  for (let i = 1; i < windowPoints.length; i++) {
    const prev = windowPoints[i - 1];
    const curr = windowPoints[i];
    const dt = (curr.ts - prev.ts) / 1000;
    totalSec += dt;
    kwWeighted += prev.kw * dt;

    if (prev.state === "RUN") runSec += dt;
    else if (prev.state === "IDLE") idleSec += dt;
    else offSec += dt;
  }

  const energyKwh =
    windowPoints[windowPoints.length - 1].kwh_total - windowPoints[0].kwh_total;
  const avgKw = totalSec > 0 ? kwWeighted / totalSec : 0;

  const pfPoints = windowPoints.filter((p) => p.state !== "OFF");
  const avgPf =
    pfPoints.length > 0
      ? pfPoints.reduce((s, p) => s + p.pf, 0) / pfPoints.length
      : 0;

  const countDelta =
    windowPoints[windowPoints.length - 1].count_total -
    windowPoints[0].count_total;
  const throughput = totalSec > 0 ? (countDelta / totalSec) * 60 : 0;

  const last = windowPoints[windowPoints.length - 1];
  const currents = [last.ir, last.iy, last.ib];
  const maxI = Math.max(...currents);
  const minI = Math.min(...currents);
  const avgI = currents.reduce((a, b) => a + b, 0) / 3;
  const imbalance = avgI > 0 ? ((maxI - minI) / avgI) * 100 : 0;

  return {
    uptime: Number((runSec / totalSec) * 100).toFixed(1),
    idle: Number((idleSec / totalSec) * 100).toFixed(1),
    off: Number((offSec / totalSec) * 100).toFixed(1),
    avgKw: Number(avgKw.toFixed(2)),
    energyKwh: Number(energyKwh.toFixed(3)),
    avgPf: Number(avgPf.toFixed(3)),
    throughput: Number(throughput.toFixed(2)),
    imbalance: Number(imbalance.toFixed(1)),
  };
};
