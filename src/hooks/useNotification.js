import { useState, useCallback, useRef } from 'react'

export function useNotification() {
  const [notif, setNotif] = useState({ msg: '', type: 'success', show: false })
  const timerRef = useRef(null)

  const notify = useCallback((msg, type = 'success') => {
    clearTimeout(timerRef.current)
    setNotif({ msg, type, show: true })
    timerRef.current = setTimeout(() => setNotif(n => ({ ...n, show: false })), 2600)
  }, [])

  return { notif, notify }
}
