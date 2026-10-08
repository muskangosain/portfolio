import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { Answer } from '../data/knowledge'
import { projects } from '../data/projects'
import { stagger } from '../lib/motion'
import ProjectCard from './ProjectCard'
import SkillsView from './SkillsView'
import ContactCard from './ContactCard'

type Props = {
  question: string
  answer: Answer
  onProgress: () => void
  onDone: () => void
}

// The UI that "builds itself" under an answer, picked by the answer's intent.
function GeneratedUI({ intent }: { intent: Answer['intent'] }) {
  switch (intent) {
    case 'projects':
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} compact />
          ))}
        </div>
      )
    case 'skills':
      return <SkillsView compact />
    case 'contact':
      return <ContactCard />
    default:
      return null
  }
}

export default function ChatResponse({ question, answer, onProgress, onDone }: Props) {
  const { typed, done } = useTypewriter(answer.text, { speed: 40, onDone })

  useEffect(onProgress, [typed, done, onProgress])

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
      {done && (
        <motion.div variants={stagger} initial="hidden" animate="show" onAnimationComplete={onProgress}>
          <GeneratedUI intent={answer.intent} />
        </motion.div>
      )}
    </div>
  )
}
