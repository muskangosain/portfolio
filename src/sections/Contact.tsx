import Section from '../components/Section'
import { profile } from '../data/profile'

export default function Contact() {
  return (
    <Section id="contact" index="04" title="Let's talk">
      <p className="max-w-lg text-lg text-muted">
        Open to frontend roles and interesting projects. The fastest way to reach me is email.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="mt-8 inline-block text-2xl font-semibold underline decoration-accent decoration-2 underline-offset-8 sm:text-4xl"
      >
        {profile.email}
      </a>
      <ul className="mt-10 flex gap-6 font-mono text-sm text-muted">
        <li>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-text">
            github
          </a>
        </li>
        <li>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-text">
            linkedin
          </a>
        </li>
        <li>
          <a href={profile.links.resume} target="_blank" rel="noreferrer" className="hover:text-text">
            resume
          </a>
        </li>
      </ul>
    </Section>
  )
}
