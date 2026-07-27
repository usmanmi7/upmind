/**
 * Shared SSE-streaming client for the AI chat endpoints.
 *
 * The backend (src/app/api/ai/chat/route.ts and /public/route.ts) emits
 * Server-Sent Events with these event types:
 *
 *   event: meta    data: { chatId?: string }
 *   event: token   data: { delta: string }              // one token chunk
 *   event: done    data: { ...structuredFields, usage }  // final payload
 *   event: error   data: { message: string }
 *
 * This helper reads the stream, calls the provided callbacks, and returns
 * an AbortController so the caller can implement "Stop generating".
 *
 * Why a shared helper: the three consumers (dashboard page, public page,
 * GlmSearchBar) all need the same logic, and getting the SSE parsing
 * right (line buffering, [DONE] handling, partial-decode edge cases)
 * is easy to mess up. Centralizing it keeps the consumers thin.
 */

export interface StreamCallbacks {
  /** Called once at stream start (before any tokens). */
  onMeta?: (data: { chatId?: string }) => void
  /** Called for every token delta. Accumulate into your display buffer. */
  onToken: (delta: string) => void
  /** Called when the stream completes. Carries the final structured payload. */
  onDone: (data: Record<string, unknown>) => void
  /** Called if the stream errors mid-flight. */
  onError?: (message: string) => void
}

/**
 * Initiate a streaming POST and pump events into the callbacks.
 *
 * Pass an `AbortController.signal` via the optional `signal` field on the
 * callbacks object so the caller can cancel mid-stream (the "Stop
 * generating" button). When aborted, no callback is fired, the caller
 * is responsible for updating its UI state on cancel.
 */
export async function streamChat(
  url: string,
  body: Record<string, unknown>,
  callbacks: StreamCallbacks & { signal?: AbortSignal }
): Promise<void> {
  const { signal, ...cbs } = callbacks

  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    })
  } catch (err) {
    if ((err as Error).name === "AbortError") return
    cbs.onError?.("Could not reach the AI service.")
    return
  }

  // ─── Non-2xx: surface error ────────────────────────────────────────
  // Quota-exhausted (402), rate-limit (429), or upstream (500) all come
  // back as regular JSON, not SSE. We forward the parsed body to onDone
  // so the caller can handle quota/rate-limit UI the same way it does
  // today.
  if (!res.ok || !res.body) {
    let payload: Record<string, unknown> = {}
    try {
      payload = await res.json()
    } catch {
      // ignore, leave payload empty
    }
    cbs.onDone(payload)
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  // If the caller aborts, release the reader so the browser stops
  // receiving bytes (otherwise the stream keeps draining in the
  // background until upstream finishes).
  if (signal) {
    signal.addEventListener("abort", () => {
      reader.cancel().catch(() => {})
    })
  }

  // SSE frames are separated by `\n\n`. Within a frame:
  //   event: <name>\n
  //   data: <json>\n
  // We buffer until we have a full frame, then dispatch.
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let sepIdx: number
      while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sepIdx)
        buffer = buffer.slice(sepIdx + 2)

        let eventName = "message"
        let dataStr = ""
        for (const line of frame.split("\n")) {
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim()
          } else if (line.startsWith("data:")) {
            dataStr += line.slice(5).trim()
          }
        }
        if (!dataStr) continue

        let data: Record<string, unknown> = {}
        try {
          data = JSON.parse(dataStr)
        } catch {
          continue
        }

        switch (eventName) {
          case "meta":
            cbs.onMeta?.(data as { chatId?: string })
            break
          case "token":
            if (typeof data.delta === "string") {
              cbs.onToken(data.delta)
            }
            break
          case "done":
            cbs.onDone(data)
            return
          case "error":
            cbs.onError?.(
              (data.message as string) || "Stream interrupted."
            )
            return
        }
      }
    }
    // Stream ended without an explicit `done` event, treat as error
    // UNLESS the caller aborted (in which case onError should NOT fire).
    if (signal?.aborted) return
    cbs.onError?.("Stream ended unexpectedly.")
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      return
    }
    cbs.onError?.("Connection lost during streaming.")
  } finally {
    try {
      reader.releaseLock()
    } catch {
      // ignore
    }
  }
}

