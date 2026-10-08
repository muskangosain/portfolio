import { motion } from 'framer-motion'
import Section from '../components/Section'
import { experience } from '../data/profile'
import { fadeUp } from '../lib/motion'

export default function Experience() {
  return (
    <Section id="experience" index="03" title="Where I've worked">
      <ol className="border-l border-border">
        {experience.map((job, i) => (
          <motion.li key={i} variants={fadeUp} className="relative pb-10 pl-8 last:pb-0">
            <span className="absolute top-2 -left-[5px] size-[9px] rounded-full bg-accent" aria-hidden="true" />
            <p className="font-mono text-xs text-muted">{job.dates}</p>
            <h3 className="mt-1 text-xl font-semibold">
              {job.role} <span className="text-muted">· {job.company}</span>
            </h3>
            <p className="mt-2 text-muted">{job.summary}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
