import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { ProjectCard } from '@/components/ProjectCard'
import { ExperienceDial } from '@/components/work/ExperienceDial'
import { homePageContent } from '@/content/home'
import { featuredProjects } from '@/content/projects'
import { workExperiences } from '@/content/work-experience'
import { useIntroState } from '@/features/intro/useIntroState'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'
import '@/styles/experience-dial.css'

const CHAR_STAGGER = 0.022
const BASE_DELAY = 0.08

const TEXT_LINES = homePageContent.hero.lines
const HERO_CHARACTER_LINES = (() => {
  let charIndex = 0

  return TEXT_LINES.map((line, lineIndex) =>
    line.split('').map((char, charIndexInLine) => {
      const item = {
        key: `${lineIndex}-${charIndexInLine}`,
        char,
        delay: BASE_DELAY + charIndex * CHAR_STAGGER,
      }

      charIndex += 1
      return item
    }),
  )
})()

const totalChars = HERO_CHARACTER_LINES.reduce(
  (count, line) => count + line.length,
  0,
)
const ENTRANCE_DURATION = (BASE_DELAY + totalChars * CHAR_STAGGER) * 1000 + 450

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
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="homepage">
        <div className="glow-orb" aria-hidden="true">
          <div className="glow-layer glow-green" />
          <div className="glow-layer glow-yellow" />
          <div className="glow-layer glow-blue" />
          <div className="glow-layer glow-pink" />
        </div>

        <section className="hero">
          <div className="hero__text-wrapper">
            <h1 className={`hero__heading${ready ? ' hero__heading--ready' : ''}`}>
              <HeroTextCSS animate={heroRevealStarted} />
            </h1>
          </div>
        </section>

        <div className="homepage__anchor" id="labs" aria-hidden="true" />
        <div className="projects-section" id="work">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} trackIntroLoad />
          ))}
        </div>

        <ExperienceSection />

        <div className="homepage__anchor" id="blog" aria-hidden="true" />
      </main>
    </>
  )
}

function ExperienceSection() {
  return (
    <section
      className="experience-section"
      id="experience"
      aria-label="Work experience"
    >
      <ExperienceDial items={workExperiences} />
    </section>
  )
}

function HeroTextCSS({ animate }: { animate: boolean }) {
  return (
    <>
      {HERO_CHARACTER_LINES.map((line, lineIdx) => (
        <span key={lineIdx} className="hero__heading-line">
          {line.map(({ key, char, delay }) => (
            <span
              key={key}
              className={`hero__char${animate ? ' hero__char--armed' : ''}`}
              style={animate ? { animationDelay: `${delay}s` } : undefined}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </>
  )
}
