import { motion } from 'framer-motion'
import type { Project } from '../data/projects'
import { fadeUp } from '../lib/motion'

export default function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <motion.article
      variants={fadeUp}
      className={`flex h-full flex-col rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-accent/60 ${compact ? 'p-4' : 'p-6'}`}
    >
      {!compact && (
        <div className="aspect-video overflow-hidden rounded-lg border border-dashed border-border">
          {project.image && <img src={project.image} alt={`Screenshot of ${project.title}`} loading="lazy" className="size-full object-cover" />}
        </div>
      )}
      <h3 className={`font-semibold ${compact ? 'text-base' : 'mt-5 text-xl'}`}>{project.title}</h3>
      <p className={`mt-2 text-muted ${compact ? 'text-sm' : ''}`}>{project.oneLiner}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
        {project.tags.map((tag, i) => (
          <li key={i} className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
            {tag}
          </li>
        ))}
      </ul>
      {(project.liveUrl || project.githubUrl) && (
        <div className="mt-auto flex gap-4 pt-5 font-mono text-xs">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
              live ↗
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-text">
              code ↗
            </a>
          )}
        </div>
      )}
    </motion.article>
  )
}
