import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

// Reveals text word by word for a "streaming" feel. With reduced motion it shows everything at once.
export function useTypewriter(text: string, { speed = 55, onDone }: { speed?: number; onDone?: () => void } = {}) {
  const reduced = useReducedMotion()
  const words = useMemo(() => text.split(/(?<=\s)/), [text])
  const [count, setCount] = useState(() => (reduced ? words.length : 0))
  const done = count >= words.length

  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (done) return
    if (reduced) {
      setCount(words.length)
      return
    }
    const timer = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(timer)
  }, [count, done, reduced, speed, words.length])

  useEffect(() => {
    if (done) onDoneRef.current?.()
  }, [done])

  return { typed: words.slice(0, count).join(''), done }
}
