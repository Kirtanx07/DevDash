import { useState, useEffect } from 'react'

export function useNetwork() {
  const [status, setStatus] = useState({ online: navigator.onLine, speed: 'measuring', latency: null })

  const measure = async () => {
    if (!navigator.onLine) { setStatus({ online: false, speed: 'offline', latency: null }); return }
    try {
      const t0 = performance.now()
      await fetch('https://www.cloudflare.com/cdn-cgi/trace?t=' + Date.now(), { cache: 'no-store', signal: AbortSignal.timeout(5000) })
      const ms = Math.round(performance.now() - t0)
      let speed = 'excellent'
      if (ms > 800) speed = 'poor'
      else if (ms > 400) speed = 'slow'
      else if (ms > 150) speed = 'good'
      setStatus({ online: true, speed, latency: ms })
    } catch {
      setStatus({ online: navigator.onLine, speed: navigator.onLine ? 'unknown' : 'offline', latency: null })
    }
  }

  useEffect(() => {
    measure()
    const id = setInterval(measure, 30000)
    window.addEventListener('online', measure)
    window.addEventListener('offline', () => setStatus({ online: false, speed: 'offline', latency: null }))
    return () => { clearInterval(id) }
  }, [])

  return status
}
