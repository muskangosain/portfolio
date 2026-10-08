import type { ReactNode } from 'react'

type Props = {
  id: string
  index: string
  title: string
  children: ReactNode
}

export default function Section({ id, index, title, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-border py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {index} / {id}
        </p>
        <h2 id={`${id}-title`} className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h2>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  )
}
