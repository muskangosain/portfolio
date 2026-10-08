import { useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import type { Answer } from '../data/knowledge'

type Props = {
  question: string
  answer: Answer
  onProgress: () => void
  onDone: () => void
}

export default function ChatResponse({ question, answer, onProgress, onDone }: Props) {
  const { typed, done } = useTypewriter(answer.text, { speed: 40, onDone })

  useEffect(onProgress, [typed, onProgress])

  return (
    <div className="space-y-3">
      <p className="font-mono text-sm text-muted">
        <span className="text-accent">&gt;</span> {question}
      </p>
      <div className="rounded-2xl rounded-tl-sm border border-border bg-surface p-5 leading-relaxed">
        <p>
          <span aria-hidden="true">{typed}</span>
          {!done && <span className="caret" aria-hidden="true" />}
          <span className="sr-only">{answer.text}</span>
        </p>
      </div>
    </div>
  )
}
