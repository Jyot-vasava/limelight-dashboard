import { createApi } from '@reduxjs/toolkit/query/react'

export const streamApi = createApi({
  reducerPath: 'streamApi',
  baseQuery: async () => ({ data: [] }),
  endpoints: (builder) => ({
    getStream: builder.query({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // Check if we're in replay mode
        const urlParams = new URLSearchParams(window.location.search)
        const isReplay = urlParams.has('replay')

        if (isReplay) {
          // REPLAY MODE — load from public/data (works on Vercel!)
          try {
            const response = await fetch('/data/device_stream_20min.jsonl')
            const text = await response.text()
            const lines = text.trim().split('\n')

            let i = 0
            const interval = setInterval(() => {
              if (i >= lines.length) {
                clearInterval(interval)
                return
              }
              const raw = JSON.parse(lines[i])
              const point = { ...raw, ts: new Date(raw.ts).getTime() }
              updateCachedData((draft) => {
                draft.push(point)
                if (draft.length > 5000) draft.shift()
              })
              i++
            }, 1000) // 1 record per second

            await cacheEntryRemoved
            clearInterval(interval)
          } catch (err) {
            console.error('Replay failed:', err)
          }
        } else {
          // LIVE MODE — try localhost SSE
          let es
          try {
            es = new EventSource('http://localhost:8080/stream')
            es.onmessage = (event) => {
              const raw = JSON.parse(event.data)
              const point = { ...raw, ts: new Date(raw.ts).getTime() }
              updateCachedData((draft) => {
                draft.push(point)
                if (draft.length > 5000) draft.shift()
              })
            }
          } catch (err) {
            console.log('No local server — use ?replay=1 for demo')
          }
          await cacheEntryRemoved
          es?.close()
        }
      },
    }),
  }),
})

export const { useGetStreamQuery } = streamApi