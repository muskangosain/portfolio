import { useState } from 'react'
import IntroBubble from '../components/IntroBubble'
import AskBar, { QuestionChips } from '../components/AskBar'
import { profile } from '../data/profile'

export default function Hero() {
  const [speaking, setSpeaking] = useState(true)
  const [questions, setQuestions] = useState<string[]>([])

  function ask(question: string) {
    setQuestions((qs) => [...qs, question])
  }

  return (
    <section id="top" aria-label="Introduction" className="flex min-h-dvh items-center pt-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 py-12 sm:px-6 md:grid-cols-[auto_1fr]">
        {/* Placeholder — becomes the particle avatar in Phase 2 */}
        <div
          className={`mx-auto grid size-56 place-items-center rounded-full border border-dashed border-border transition-colors duration-500 sm:size-72 ${speaking ? 'speaking' : ''}`}
        >
          <span className="font-mono text-xs text-muted">[ particle avatar ]</span>
        </div>

        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {profile.role} · {profile.location}
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">{profile.name}</h1>

          <div className="mt-8 space-y-5">
            <IntroBubble onDone={() => setSpeaking(false)} />
            <QuestionChips onAsk={ask} />
            {questions.map((q, i) => (
              <p key={i} className="font-mono text-sm text-muted">
                <span className="text-accent">&gt;</span> {q}
              </p>
            ))}
            <AskBar onAsk={ask} />
          </div>
        </div>
      </div>
    </section>
  )
}
