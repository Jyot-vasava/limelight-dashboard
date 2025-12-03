# LimelightIT — Device Stream Dashboard  
**Real-time 1 Hz Industrial Dashboard** | React + Vite + RTK Query + uPlot + Tailwind  

**Live URL**: https://limelight-dashboard-omega.vercel.app/
**Reply URL**: https://limelight-dashboard-omega.vercel.app/?replay=1  
**GitHub**: https://github.com/Jyot-vasava/limelight-dashboard  

---

### KPI Calculation Methods (as requested)

- **Uptime / Idle / Off %** → time-weighted duration of each state in window  
- **Average kW** → time-weighted average (not sample average)  
- **Energy (kWh)** → `max(kwh_total) − min(kwh_total)` in window (correct register method)  
- **PF average** → arithmetic mean over RUN + IDLE samples only (OFF ignored)  
- **Throughput** → `Δcount_total / window_minutes` + rolling 60-sec rate  
- **Phase imbalance %** → `(max−min)/avg × 100` of latest currents  

All calculations in pure functions → `src/lib/calculateKPIs.js`

---

### Auto-Insights Implemented

1. **Prolonged Idle** → ≥25 min contiguous IDLE (28 min detected)  
2. **Peak 15-min Demand** → rolling 15-min average kW, max reported  
3. **Severe Phase Imbalance** → >15% for ≥2 min (multiple events in data)  

**Demo note**: For the video, I temporarily forced all 3 insights to appear after 60 points (so they show instantly). Real logic uses full thresholds — both versions in code, clearly commented.

---

### SSE_live_server (works on vercel with local server)

# Start the SSE server (included path:"limelight-dashboard/public/data/live_sse_server.js")
node "live_sse_server.js"
# Then open this link
URL:https://limelight-dashboard-omega.vercel.app/


### Replay Mode (works on Vercel without local server)
Just add `?replay=1` to the URL:  
https://limelight-dashboard-omega.vercel.app/?replay=1

---

### Tech Stack (chosen for performance & production readiness)

- **React 18 + Vite** → fastest dev server  
- **RTK Query** → true real-time streaming with automatic cleanup  
- **uPlot** → 11 kB, 60 FPS even with 5000+ points (Recharts would lag)  
- **Tailwind CSS** → responsive, dark mode ready, beautiful out of the box  
- **Redux Toolkit** → clean, scalable state management  

---



