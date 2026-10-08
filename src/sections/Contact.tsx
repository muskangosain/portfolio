import { motion } from 'framer-motion'
import Section from '../components/Section'
import ContactCard from '../components/ContactCard'
import { fadeUp } from '../lib/motion'

export default function Contact() {
  return (
    <Section id="contact" index="04" title="Let's talk">
      <motion.p variants={fadeUp} className="max-w-lg text-lg text-muted">
        Open to frontend roles and interesting projects. The fastest way to reach me is email.
      </motion.p>
      <div className="mt-8 max-w-xl">
        <ContactCard />
      </div>
    </Section>
  )
}
