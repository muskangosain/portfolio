import { useTypewriter } from '../hooks/useTypewriter'
import { profile } from '../data/profile'

const intro = `Hey, I'm ${profile.firstName} 👋 — a frontend developer who makes interfaces feel alive. You can scroll like a normal website… or just ask me anything.`

export default function IntroBubble({ onDone }: { onDone: () => void }) {
  const { typed, done } = useTypewriter(intro, { onDone })

  return (
    <div className="rounded-2xl rounded-tl-sm border border-border bg-surface p-5 text-lg leading-relaxed">
      <p>
        <span aria-hidden="true">{typed}</span>
        {!done && <span className="caret" aria-hidden="true" />}
        <span className="sr-only">{intro}</span>
      </p>
    </div>
  )
}
