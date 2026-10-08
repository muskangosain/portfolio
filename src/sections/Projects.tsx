import Section from '../components/Section'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <Section id="projects" index="01" title="Things I've built">
      <ul className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.title} className="rounded-2xl border border-border bg-surface p-6">
            <div className="aspect-video rounded-lg border border-dashed border-border" aria-hidden="true" />
            <h3 className="mt-5 text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 text-muted">{project.oneLiner}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
              {project.tags.map((tag, i) => (
                <li key={i} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  )
}
