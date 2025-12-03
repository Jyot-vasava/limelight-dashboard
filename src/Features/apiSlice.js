import { createApi } from "@reduxjs/toolkit/query/react";

export const streamApi = createApi({
  reducerPath: "streamApi",
  baseQuery: async () => ({ data: [] }),
  endpoints: (builder) => ({
    getStream: builder.query({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        let es;
        try {
          await cacheDataLoaded;

          // Use replay mode if ?replay=1 in URL (for demo without server)
          const urlParams = new URLSearchParams(window.location.search);

          if (urlParams.get("replay") || window.location.pathname.endsWith("replay.html")) {
              return;
          }


          // Dev/prod handling for Vercel
          const isDev =
            import.meta.env.DEV || window.location.hostname === "localhost";
          const url = "http://localhost:8080/stream" || "https://limelight-sse-server.onrender.com/" ; // or your public CORS proxy if you have one

          if (!url) {
            console.warn(
              "No live stream in production — add ?replay=1 to test"
            );
            return;
          }

          es = new EventSource(url);
          es.onmessage = (event) => {
            try {
              const raw = JSON.parse(event.data);
              const point = {
                ...raw,
                ts: new Date(raw.ts).getTime(),
              };
              updateCachedData((draft) => {
                draft.push(point);
                if (draft.length > 5000) draft.shift();
              });
            } catch (e) {
              console.error("Parse error", e);
            }
          };
          es.onerror = () => console.error("SSE error");
        } catch (err) {
          console.error("SSE setup failed", err);
        }
        await cacheEntryRemoved;
        es?.close();
      },
    }),
  }),
});

export const { useGetStreamQuery } = streamApi;
