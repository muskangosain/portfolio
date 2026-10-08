import { useState, type FormEvent } from 'react'

export const suggestions = ['Show me your projects', "What's your stack?", 'Are you open to work?', 'Surprise me']

export function QuestionChips({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
      {suggestions.map((question) => (
        <li key={question}>
          <button
            type="button"
            onClick={() => onAsk(question)}
            className="rounded-full border border-border px-3.5 py-1.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function AskBar({ onAsk }: { onAsk: (question: string) => void }) {
  const [value, setValue] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    const question = value.trim()
    if (!question) return
    onAsk(question)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-1.5 pl-5 transition-colors duration-200 focus-within:border-accent"
    >
      <label htmlFor="ask" className="sr-only">
        Ask me anything
      </label>
      <span className="font-mono text-sm text-accent" aria-hidden="true">
        &gt;
      </span>
      <input
        id="ask"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask me anything…"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-muted/60"
      />
      <button
        type="submit"
        aria-label="Ask"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-bg transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  )
}
