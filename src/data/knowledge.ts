import { experience, profile, skills } from './profile'
import { projects } from './projects'

// The intent decides which UI renders under the answer (cards arrive in Phase 4).
export type Intent = 'projects' | 'skills' | 'contact' | 'experience' | 'about' | 'greeting' | 'surprise' | 'fallback'

export type Answer = { intent: Intent; text: string }

const list = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items.join('')

// Placeholders — swap in real fun facts about yourself.
const funFacts = [
  '[A fun fact about you — something a recruiter would remember.]',
  '[A small thing you built just for fun.]',
  '[Something you nerd out about outside of code.]',
]

const intents: { intent: Exclude<Intent, 'fallback'>; keywords: string[]; answer: () => string }[] = [
  {
    intent: 'projects',
    keywords: ['project', 'projects', 'built', 'build', 'portfolio', 'made', 'apps', 'app', 'show'],
    answer: () =>
      `Here's what I've been building: ${list(projects.map((p) => p.title))}. Each one taught me something different — ask me about any of them.`,
  },
  {
    intent: 'skills',
    keywords: ['stack', 'skill', 'skills', 'tech', 'technologies', 'tools', 'languages', 'react', 'typescript', 'know', 'use'],
    answer: () =>
      `My main stack is ${list(skills.Frontend)}. Day to day I live in ${list(skills.Tools)}. Right now I'm learning ${list(skills.Learning)}.`,
  },
  {
    intent: 'contact',
    keywords: ['contact', 'hire', 'hiring', 'email', 'reach', 'open', 'work', 'available', 'job', 'role', 'resume', 'cv', 'talk'],
    answer: () =>
      `Yes — I'm open to frontend roles and interesting projects. The fastest way to reach me is ${profile.email}, and my resume is one click away at the top of the page.`,
  },
  {
    intent: 'experience',
    keywords: ['experience', 'worked', 'company', 'companies', 'career', 'background', 'jobs'],
    answer: () => {
      const job = experience[0]
      return `Most recently I was ${job.role} at ${job.company} (${job.dates}) — ${job.summary}`
    },
  },
  {
    intent: 'about',
    keywords: ['who', 'about', 'yourself', 'name', 'from', 'where', 'location'],
    answer: () => `I'm ${profile.name}, a ${profile.role.toLowerCase()} based in ${profile.location}. ${profile.oneLiner}`,
  },
  {
    intent: 'greeting',
    keywords: ['hi', 'hey', 'hello', 'yo', 'sup', 'hii', 'heyy'],
    answer: () => `Hey! 👋 Ask me about my projects, my stack, or how to reach me.`,
  },
  {
    intent: 'surprise',
    keywords: ['surprise', 'fun', 'random', 'fact', 'interesting', 'hobby', 'hobbies'],
    answer: () => funFacts[Math.floor(Math.random() * funFacts.length)],
  },
]

// Scores each intent by how many of its keywords appear in the question; the best match wins.
export function getAnswer(question: string): Answer {
  const words = new Set(question.toLowerCase().match(/[a-z']+/g) ?? [])

  let best: (typeof intents)[number] | null = null
  let bestScore = 0
  for (const entry of intents) {
    const score = entry.keywords.filter((k) => words.has(k)).length
    if (score > bestScore) {
      best = entry
      bestScore = score
    }
  }

  if (!best) {
    return {
      intent: 'fallback',
      text: "I don't have a good answer for that one yet — try asking about my projects, my stack, my experience, or how to reach me.",
    }
  }
  return { intent: best.intent, text: best.answer() }
}
