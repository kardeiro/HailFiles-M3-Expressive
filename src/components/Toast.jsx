import { useState, useEffect, useCallback, useRef } from 'react'

export default function Toast({ message }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timerRef.current)
  }, [message])

  return (
    <div className={`toast${visible ? ' show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
      {message}
    </div>
  )
}
