import { motion } from 'framer-motion'
import { skills } from '../data/profile'
import { fadeUp, stagger } from '../lib/motion'

export default function SkillsView({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-8 ${compact ? '' : 'sm:grid-cols-3'}`}>
      {Object.entries(skills).map(([group, items]) => (
        <div key={group}>
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted">{group}</h3>
          <motion.ul variants={stagger} className="mt-3 flex flex-wrap gap-2">
            {items.map((skill) => (
              <motion.li
                key={skill}
                variants={fadeUp}
                className={`rounded-full border border-border bg-surface px-3 py-1.5 ${compact ? 'text-xs' : 'text-sm'} ${group === 'Learning' ? 'border-dashed' : ''}`}
              >
                {skill}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      ))}
    </div>
  )
}
