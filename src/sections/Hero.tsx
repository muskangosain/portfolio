import { useCallback, useRef, useState } from 'react'
import IntroBubble from '../components/IntroBubble'
import AskBar, { QuestionChips } from '../components/AskBar'
import ChatResponse from '../components/ChatResponse'
import ParticleAvatar from '../components/ParticleAvatar'
import { getAnswer, type Answer } from '../data/knowledge'
import { profile } from '../data/profile'

type Message = { id: number; question: string; answer: Answer }

export default function Hero() {
  // Which message is currently "talking" — the intro first, then each answer as it streams.
  const [streamingId, setStreamingId] = useState<number | 'intro' | null>('intro')
  const [messages, setMessages] = useState<Message[]>([])
  const nextId = useRef(0)
  const threadRef = useRef<HTMLDivElement>(null)

  const speaking = streamingId !== null

  function ask(question: string) {
    const id = nextId.current++
    setMessages((ms) => [...ms, { id, question, answer: getAnswer(question) }])
    setStreamingId(id)
  }

  const stopSpeaking = (id: number | 'intro') => setStreamingId((current) => (current === id ? null : current))

  const scrollThread = useCallback(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTop = thread.scrollHeight
  }, [])

  return (
    <section id="top" aria-label="Introduction" className="flex min-h-dvh items-center pt-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 py-12 sm:px-6 md:grid-cols-[auto_1fr]">
        <div
          className={`relative mx-auto size-56 rounded-full border border-transparent transition-colors duration-500 sm:size-72 ${speaking ? 'speaking' : ''}`}
        >
          <ParticleAvatar src="/avatar.jpg" alt={`Portrait of ${profile.name}`} speaking={speaking} />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {profile.role} · {profile.location}
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">{profile.name}</h1>

          <div className="mt-8 space-y-5">
            <div ref={threadRef} role="log" aria-live="polite" className="max-h-[32rem] space-y-5 overflow-y-auto pr-1">
              <IntroBubble onDone={() => stopSpeaking('intro')} />
              {messages.map((m) => (
                <ChatResponse
                  key={m.id}
                  question={m.question}
                  answer={m.answer}
                  onProgress={scrollThread}
                  onDone={() => stopSpeaking(m.id)}
                />
              ))}
            </div>
            <QuestionChips onAsk={ask} />
            <AskBar onAsk={ask} />
          </div>
        </div>
      </div>
    </section>
  )
}
