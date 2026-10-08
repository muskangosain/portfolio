import { useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { fadeUp } from '../lib/motion'

export default function ContactCard() {
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">email</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <a href={`mailto:${profile.email}`} className="text-lg font-semibold break-all hover:text-accent sm:text-xl">
          {profile.email}
        </a>
        <button
          type="button"
          onClick={copyEmail}
          className="rounded-full bg-accent px-4 py-1.5 font-mono text-xs text-bg transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          {copied ? 'copied ✓' : 'copy'}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email copied to clipboard' : ''}
        </span>
      </div>
      <ul className="mt-5 flex flex-wrap gap-5 font-mono text-sm text-muted">
        <li>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-text">
            github ↗
          </a>
        </li>
        <li>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-text">
            linkedin ↗
          </a>
        </li>
        <li>
          <a href={profile.links.resume} target="_blank" rel="noreferrer" className="hover:text-text">
            resume ↗
          </a>
        </li>
      </ul>
    </motion.div>
  )
}
