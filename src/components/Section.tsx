import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ease, fadeUp, stagger } from '../lib/motion'

type Props = {
  id: string
  index: string
  title: string
  children: ReactNode
}

export default function Section({ id, index, title, children }: Props) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="border-t border-border py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.p variants={fadeUp} className="font-mono text-xs uppercase tracking-widest text-accent">
          {index} / {id}
        </motion.p>
        {/* Masked slide-up: the heading rises from behind an invisible edge */}
        <h2 id={`${id}-title`} className="mt-3 overflow-hidden pb-1 text-3xl font-semibold tracking-tight sm:text-5xl">
          <motion.span
            className="block"
            variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.7, ease } } }}
          >
            {title}
          </motion.span>
        </h2>
        <motion.div variants={stagger} className="mt-12">
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}
