import React from 'react'

export function Notification({ msg, type, show }) {
  return (
    <div className={`notification ${show ? 'show' : ''} ${type === 'error' ? 'error' : ''}`}>
      // {msg}
    </div>
  )
}
