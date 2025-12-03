const findContiguous = (points, condition) => {
  const periods = [];
  let start = null;
  for (let i = 0; i <= points.length; i++) {
    const p = points[i];
    if (i < points.length && condition(p)) {
      if (!start) start = p.ts;
    } else if (start) {
      periods.push({
        start,
        end: points[i - 1].ts,
        durationSec: (points[i - 1].ts - start) / 1000,
      });
      start = null;
    }
  }
  return periods;
};

export const detectInsights = (points) => {
  // DEMO MODE: Force all 3 insights to appear instantly
  // if (points.length > 60) {
  //   return [
  //     {
  //       type: "idle",
  //       title: "Prolonged Idle Detected",
  //       desc: "Machine was IDLE for 28 minutes",
  //       severity: "warning",
  //     },
  //     {
  //       type: "peak",
  //       title: "High Peak Demand",
  //       desc: "Max 15-min demand: 87.4 kW at 14:32",
  //       severity: "info",
  //     },
  //     {
  //       type: "imbalance",
  //       title: "Severe Phase Imbalance",
  //       desc: "Imbalance >15% for 4+ min — check connections!",
  //       severity: "error",
  //     },
  //   ];
  // }

  // REAL LOGIC BELOW 
  const insights = [];

  // 1. Long Idle ≥25 min
  const idlePeriods = findContiguous(points, (p) => p.state === "IDLE");
  const longIdle = idlePeriods.find((p) => p.durationSec >= 25 * 60);
  if (longIdle) {
    insights.push({
      type: "idle",
      title: "Prolonged Idle Detected",
      desc: `Machine was IDLE for ${Math.round(longIdle.durationSec / 60)} minutes`,
      severity: "warning",
    });
  }

  // 2. Peak 15-min demand
  let peak15 = { kw: 0, time: null };
  for (let i = 0; i < points.length - 900; i++) {
    const slice = points.slice(i, i + 900);
    const avg = slice.reduce((s, p) => s + p.kw, 0) / 900;
    if (avg > peak15.kw) {
      peak15 = { kw: avg, time: points[i + 450].ts };
    }
  }
  if (peak15.kw > 70) {
    insights.push({
      type: "peak",
      title: "High Peak Demand",
      desc: `Max 15-min demand: ${peak15.kw.toFixed(1)} kW at ${new Date(
        peak15.time
      ).toLocaleTimeString()}`,
      severity: "info",
    });
  }

  // 3. Phase imbalance >15% for ≥2 min
  const imbalancePeriods = findContiguous(points, (p) => {
    const [ir, iy, ib] = [p.ir, p.iy, p.ib];
    const max = Math.max(ir, iy, ib);
    const min = Math.min(ir, iy, ib);
    const avg = (ir + iy + ib) / 3;
    return avg > 5 && ((max - min) / avg) * 100 > 15;
  });
  const bad = imbalancePeriods.find((p) => p.durationSec >= 120);
  if (bad) {
    insights.push({
      type: "imbalance",
      title: "Severe Phase Imbalance",
      desc: `Imbalance >15% for ${Math.round(bad.durationSec / 60)} min — check connections!`,
      severity: "error",
    });
  }

  return insights;
};
