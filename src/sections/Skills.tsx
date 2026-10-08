import Section from '../components/Section'
import { skills } from '../data/profile'

export default function Skills() {
  return (
    <Section id="skills" index="02" title="What I work with">
      <div className="grid gap-10 sm:grid-cols-3">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group}>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted">{group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((skill) => (
                <li key={skill} className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
