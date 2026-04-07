import { Navbar } from '@/components/Navbar'
import { FloatingBadge } from '@/components/FloatingBadge'
import { ProjectCard } from '@/components/ProjectCard'
import heroImage from '@/assets/hero.png'

const CHAR_STAGGER = 0.022
const BASE_DELAY = 0.2

const TEXT_LINES = [
  'Curious Designer ',
  'building products ',
  'through clear systems.',
]

// Total chars before last line — used to time the badge entrance
const totalChars = TEXT_LINES.reduce((n, l) => n + l.length, 0)
export const BADGE_DELAY = BASE_DELAY + (totalChars * CHAR_STAGGER) + 0.15

export default function HomePage() {
  return (
    <main className="homepage">
      {/* Glow orb — 4 stacked opacity layers, GPU composited */}
      <div className="glow-orb" aria-hidden="true">
        <div className="glow-layer glow-green" />
        <div className="glow-layer glow-yellow" />
        <div className="glow-layer glow-blue" />
        <div className="glow-layer glow-pink" />
      </div>

      <Navbar />

      <section className="hero">
        <div className="hero__text-wrapper">
          <h1 className="hero__heading">
            <HeroTextCSS />
          </h1>
          <FloatingBadge label="PRODUCT" delay={BADGE_DELAY} />
        </div>
      </section>

      <div className="projects-section" id="work">
        <ProjectCard
          imageSrc={heroImage}
          title="RideXpress"
          description="Redesigning the core infrastructure for how assessments are done"
        />
      </div>
    </main>
  )
}

function HeroTextCSS() {
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
                className="hero__char"
                style={{ animationDelay: `${delay}s` }}
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
