import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { FloatingBadge } from '@/components/FloatingBadge'
import { ProjectCard } from '@/components/ProjectCard'
import { useIntroState } from '@/features/intro/useIntroState'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'

const CHAR_STAGGER = 0.022
const BASE_DELAY = 0.08

const TEXT_LINES = [
  'Curious Designer ',
  'building products ',
  'through clear systems.',
]

const totalChars = TEXT_LINES.reduce((n, l) => n + l.length, 0)
const ENTRANCE_DURATION = (BASE_DELAY + totalChars * CHAR_STAGGER) * 1000 + 450
export const BADGE_DELAY = BASE_DELAY + (totalChars * CHAR_STAGGER) + 0.15

export default function HomePage() {
  const { introHandoffStarted, introComplete } = useIntroState()
  const [ready, setReady] = useState(false)
  const heroRevealStarted = introHandoffStarted || introComplete

  useStartupRouteReady()

  useEffect(() => {
    if (!heroRevealStarted) {
      return undefined
    }

    const id = setTimeout(() => setReady(true), ENTRANCE_DURATION)
    return () => clearTimeout(id)
  }, [heroRevealStarted])

  return (
    <main className="homepage">
      <div className="glow-orb" aria-hidden="true">
        <div className="glow-layer glow-green" />
        <div className="glow-layer glow-yellow" />
        <div className="glow-layer glow-blue" />
        <div className="glow-layer glow-pink" />
      </div>

      <Navbar />

      <section className="hero">
        <div className="hero__text-wrapper">
          <h1 className={`hero__heading${ready ? ' hero__heading--ready' : ''}`}>
            <HeroTextCSS animate={heroRevealStarted} />
          </h1>
          {heroRevealStarted ? (
            <FloatingBadge label="PRODUCT" delay={BADGE_DELAY} />
          ) : null}
        </div>
      </section>

      <div className="projects-section" id="work">
        <ProjectCard
          imageSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&h=1200&fit=crop"
          label="Case Study"
          title="Question Library"
          description="Replaced a flat question table with a skill-first explorer — cutting duplication, surfacing structure, and laying the foundation for AI-driven assessments."
          hoverSummary="Skill-first question library — less duplication, clearer structure, AI-ready."
          role="Product Designer"
          timeline="8 weeks"
          tags={['Product Design', 'Systems Thinking', 'Enterprise']}
          to="/projects/question-library"
          trackIntroLoad
        />
      </div>
    </main>
  )
}

function HeroTextCSS({ animate }: { animate: boolean }) {
  let charIndex = 0

  return (
    <>
      {TEXT_LINES.map((line, lineIdx) => (
        <span key={lineIdx} className="hero__heading-line">
          {line.split('').map((char) => {
            const delay = BASE_DELAY + charIndex * CHAR_STAGGER
            charIndex++
            return (
              <span
                key={charIndex}
                className={`hero__char${animate ? ' hero__char--armed' : ''}`}
                style={animate ? { animationDelay: `${delay}s` } : undefined}
              >
                {char}
              </span>
            )
          })}
        </span>
      ))}
    </>
  )
}
