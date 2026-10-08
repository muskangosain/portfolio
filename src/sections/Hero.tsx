import { profile } from '../data/profile'

export default function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="flex min-h-dvh items-center pt-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[auto_1fr]">
        {/* Placeholder — becomes the particle avatar in Phase 2 */}
        <div className="mx-auto grid size-56 place-items-center rounded-full border border-dashed border-border sm:size-72">
          <span className="font-mono text-xs text-muted">[ particle avatar ]</span>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {profile.role} · {profile.location}
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">{profile.name}</h1>
          <p className="mt-6 max-w-lg text-lg text-muted">{profile.oneLiner}</p>

          {/* Placeholder — intro bubble, question chips and ask bar arrive in Phase 3 */}
          <div className="mt-10 rounded-2xl border border-dashed border-border p-4 font-mono text-xs text-muted">
            [ intro bubble · question chips · ask bar ]
          </div>
        </div>
      </div>
    </section>
  )
}
