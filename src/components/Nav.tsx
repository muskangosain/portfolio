import { profile } from '../data/profile'

const items = ['projects', 'skills', 'experience', 'contact']

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-mono text-sm font-medium">
          {profile.firstName.toLowerCase()}
          <span className="text-accent">.</span>
        </a>
        <ul className="hidden items-center gap-8 font-mono text-xs text-muted sm:flex">
          {items.map((item) => (
            <li key={item}>
              <a href={`#${item}`} className="transition-colors duration-200 hover:text-text">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={profile.links.resume}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-accent px-4 py-1.5 font-mono text-xs text-accent transition-colors duration-200 hover:bg-accent hover:text-bg"
        >
          resume
        </a>
      </nav>
    </header>
  )
}
