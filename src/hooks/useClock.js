import { useState, useEffect } from 'react'

export function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return {
    time,
    timeStr: time.toLocaleTimeString('en-GB', { hour12: false }),
    dateStr: time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
  }
}
