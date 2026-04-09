import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { Navbar } from '@/components/Navbar'
import { ArrowLeft } from '@/components/icons/ArrowLeft'
import NumberTicker from '@/components/fancy/NumberTicker'
import '@/styles/case-study.css'

const imgHero =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&h=1200&fit=crop'
const imgDuplicates =
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&h=800&fit=crop'
const imgTableV1 =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'
const imgFinalSystem =
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop'

const smoothEase = [0.4, 0, 0.2, 1] as const

const revealProps = {
  initial: { opacity: 0, y: 16 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-80px' } as const,
  transition: { duration: 0.5, ease: smoothEase } as const,
}

function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="case-study__stats">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0 }}
      >
        <p className="case-study__stat-value">
          ₹
          <NumberTicker
            from={30}
            target={60}
            autoStart={isInView}
            transition={{ duration: 2.2, ease: smoothEase }}
          />
          L
        </p>
        <p className="case-study__stat-desc">
          wasted on duplicate content and cleanup effort
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <p className="case-study__stat-value">
          <NumberTicker
            from={4}
            target={8}
            autoStart={isInView}
            transition={{ duration: 2.2, ease: smoothEase }}
          />{' '}
          wks
        </p>
        <p className="case-study__stat-desc">from concept to shipped solution</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="case-study__stat-value">
          <NumberTicker
            from={50}
            target={100}
            autoStart={isInView}
            transition={{ duration: 2.2, ease: smoothEase }}
          />
          +
        </p>
        <p className="case-study__stat-desc">
          hours lost to normalization and rework
        </p>
      </motion.div>
    </div>
  )
}

export default function QuestionLibraryCaseStudy() {
  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isWrong, setIsWrong] = useState(false)

  const handleUnlock = () => {
    if (password.toLowerCase() === 'talview') {
      setIsUnlocked(true)
      setIsWrong(false)
    } else if (password.length > 0) {
      setIsWrong(true)
    }
  }

  return (
    <div className="case-study">
      <Navbar />

      {/* Hero */}
      <section className="case-study__section case-study__section--hero">
        <motion.div {...revealProps}>
          <Link to="/#work" className="case-study__back">
            <ArrowLeft /> Back to projects
          </Link>

          <h1 className="case-study__title">
            Building a Question Library That Thinks in Skills
          </h1>

          <p className="case-study__subtitle">
            A new explorer based system that makes skill structure visible,
            reduces duplication, and prepares the Assessment Engine for AI-driven
            workflows.
          </p>

          <div className="case-study__meta">
            <span>
              <span className="case-study__meta-label">Role:</span> Product
              Designer
            </span>
            <span>
              <span className="case-study__meta-label">Timeline:</span> 8 weeks
            </span>
            <span>
              <span className="case-study__meta-label">Stakeholders:</span> CTO,
              Associate PM, Lead PM
            </span>
          </div>

          <p className="case-study__shipped">
            <span className="case-study__shipped-label">Shipped:</span> Skill
            Taxonomy explorer + question context preview
          </p>
        </motion.div>
      </section>

      {/* Hero Image */}
      <section className="case-study__hero-image">
        <motion.figure {...revealProps}>
          <img src={imgHero} alt="Skill Taxonomy explorer interface" />
          <figcaption className="case-study__figcaption">
            Final explorer-based Skill Taxonomy experience
          </figcaption>
        </motion.figure>
      </section>

      {/* Context */}
      <section className="case-study__section">
        <motion.div className="case-study__prose" {...revealProps}>
          <p className="case-study__label">Context</p>
          <p>
            Question Library is the operating system for assessments, grading,
            and report generation.
          </p>
          <p>
            Talview is a B2B SaaS company in HR tech building an Agentic AI
            experience across proctoring, interviewing, and candidate evaluation.
            The Question Library sits inside the Assessment Engine and powers how
            assessments are created, evaluated, and scaled.
          </p>
          <p className="case-study__prose--emphasis">
            Before AI could reason about skills, humans needed a way to define
            them clearly and consistently.
          </p>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="case-study__section">
        <motion.div className="case-study__grid" {...revealProps}>
          <div>
            <p className="case-study__label">The Problem</p>
            <h3 className="case-study__subheading">Where reuse failed</h3>
            <p className="case-study__body">
              SMEs build assessments by deciding which skills matter, then
              finding or creating questions that reliably test those skills.
            </p>
            <p className="case-study__body">
              The old system stored questions in a large table with tags and
              filters. Searching for a skill often returned many similar
              questions with different names, tags, or formats.
            </p>
            <p className="case-study__body case-study__body--emphasis">
              So reuse collapsed. People recreated questions instead of reusing
              them.
            </p>
            <ul className="case-study__list">
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Similar questions, different tags
              </li>
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                No canonical source of truth
              </li>
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Recreating felt safer than reusing
              </li>
            </ul>
          </div>
          <figure>
            <img
              src={imgDuplicates}
              alt="Search returned many near-duplicates without context"
            />
            <figcaption className="case-study__figcaption">
              Search returned many near-duplicates without context or ownership
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* Why This Mattered */}
      <section className="case-study__section case-study__section--surface">
        <motion.div className="case-study__section-inner" {...revealProps}>
          <p className="case-study__label">Why This Mattered</p>
          <p className="case-study__body" style={{ maxWidth: '42rem' }}>
            This was not just a usability issue. It created noise for humans and
            for AI.
          </p>
          <StatsSection />
          <p className="case-study__body case-study__body--muted case-study__body--sm">
            Imports arrived in Word, PDF, Excel, and Markdown, each requiring
            manual standardization.
          </p>
        </motion.div>
      </section>

      {/* What the Obvious Fix Missed */}
      <section className="case-study__section">
        <motion.div {...revealProps}>
          <div className="case-study__prose">
            <p className="case-study__label">What the Obvious Fix Missed</p>
            <p>
              My first instinct was to fix the table. Cleaner layout, better
              filters, less clutter.
            </p>
            <p className="case-study__prose--emphasis">
              It failed because tables flatten relationships. Skills are not
              rows. Improving the surface did not change how users reasoned or
              reused content.
            </p>
          </div>
          <figure className="case-study__figure">
            <img src={imgTableV1} alt="V1 improved table layout" />
            <figcaption className="case-study__figcaption">
              V1 improved the table, but the mental model stayed flat
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* The Reframe */}
      <section className="case-study__section">
        <motion.div className="case-study__grid" {...revealProps}>
          <div>
            <p className="case-study__label">The Reframe</p>
            <p className="case-study__display">
              The real problem was the mental model.
            </p>
            <p className="case-study__body">
              People already understand how to organize complex systems. They do
              it daily in tools like Finder and Figma.
            </p>
            <p className="case-study__body case-study__body--emphasis">
              Hierarchy is a human pattern we already trust.
            </p>
            <ul className="case-study__list case-study__list--spaced">
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Skills behave like folders
              </li>
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Questions behave like files
              </li>
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Hierarchy becomes visible
              </li>
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Context stays intact
              </li>
              <li className="case-study__list-item">
                <span className="case-study__list-bullet" />
                Reuse becomes natural
              </li>
            </ul>
          </div>
          <figure>
            <div
              className="case-study__panels"
              role="img"
              aria-label="From rows and tags to hierarchy and context"
            >
              {/* Panel A: Rows + Tags */}
              <motion.div
                className="case-study__panel"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <p className="case-study__panel-title">Rows + Tags</p>
                <div className="case-study__panel-rows">
                  {[
                    { q: 'Q: Define polymorphism', tag: 'OOP', dim: false },
                    { q: 'Q: Explain inheritance', tag: 'OOP', dim: false },
                    {
                      q: 'Q: What is polymorphism?',
                      tag: 'Java',
                      dim: false,
                    },
                    {
                      q: 'Q: Describe OOP concepts',
                      tag: 'General',
                      dim: true,
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="case-study__panel-row"
                    >
                      <motion.span
                        className={`case-study__panel-question${row.dim ? ' case-study__panel-question--dim' : ''}`}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 * i,
                          ease: smoothEase,
                        }}
                      >
                        {row.q}
                      </motion.span>
                      <motion.span
                        className="case-study__panel-tag"
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.3,
                          delay: 0.5 + 0.08 * i,
                          ease: smoothEase,
                        }}
                      >
                        {row.tag}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Panel B: Folders + Files */}
              <motion.div
                className="case-study__panel"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.15, ease: smoothEase }}
              >
                <p className="case-study__panel-title">Folders + Files</p>
                <div className="case-study__tree">
                  <div className="case-study__tree-folder">
                    <motion.span
                      className="case-study__tree-chevron"
                      initial={{ rotate: -90 }}
                      whileInView={{ rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: 0.4,
                        ease: smoothEase,
                      }}
                    >
                      ▾
                    </motion.span>
                    Programming
                  </div>

                  <motion.div
                    className="case-study__tree-children"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: 'auto', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.55,
                      ease: smoothEase,
                    }}
                  >
                    <div className="case-study__tree-folder">
                      <motion.span
                        className="case-study__tree-chevron"
                        initial={{ rotate: -90 }}
                        whileInView={{ rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.75,
                          ease: smoothEase,
                        }}
                      >
                        ▾
                      </motion.span>
                      OOP
                    </div>

                    <motion.div
                      className="case-study__tree-children"
                      initial={{ height: 0, opacity: 0 }}
                      whileInView={{ height: 'auto', opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.9,
                        ease: smoothEase,
                      }}
                    >
                      {['Polymorphism', 'Inheritance'].map((name, i) => (
                        <motion.div
                          key={name}
                          className="case-study__tree-leaf"
                          initial={{ opacity: 0, x: -6 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.35,
                            delay: 1.0 + 0.1 * i,
                            ease: smoothEase,
                          }}
                        >
                          <span className="case-study__tree-dot" /> {name}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      className="case-study__tree-folder"
                      initial={{ opacity: 0, x: -6 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: 1.2,
                        ease: smoothEase,
                      }}
                    >
                      <span className="case-study__tree-chevron">▸</span>{' '}
                      Functional
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <figcaption className="case-study__figcaption">
              From rows and tags to hierarchy and context
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* The System */}
      <section className="case-study__section">
        <motion.div {...revealProps}>
          <p className="case-study__label">The System</p>
          <p
            className="case-study__body"
            style={{ maxWidth: '48rem', marginTop: 'var(--space-6)' }}
          >
            The final design introduced a hierarchical skill explorer paired
            with an instant preview pane. Selecting a skill surfaces its
            description, related domains, and associated questions in context.
            Questions stay embedded within the hierarchy to preserve meaning and
            ownership.
          </p>
          <p
            className="case-study__body case-study__body--emphasis"
            style={{ maxWidth: '48rem' }}
          >
            Selecting a skill shows details and linked questions instantly,
            without modals.
          </p>
          <figure className="case-study__figure">
            <img
              src={imgFinalSystem}
              alt="Skill Taxonomy explorer: skill tree on left, preview pane in center, question metadata inline"
            />
            <figcaption className="case-study__figcaption">
              Structure does the work, the interface stays quiet
            </figcaption>
          </figure>
        </motion.div>
      </section>

      {/* My Role & Ownership */}
      <section className="case-study__section case-study__section--surface">
        <motion.div
          className="case-study__section-inner case-study__prose"
          {...revealProps}
        >
          <p className="case-study__label">My Role &amp; Ownership</p>
          <p>
            After the first iteration, leadership explicitly pushed for a
            fundamentally different approach. From that point, I owned problem
            reframing, the new mental model, the explorer structure, and
            iterative exploration.
          </p>
          <p>
            The Associate PM helped validate direction and filter feedback.
            Reviews with the CTO and PM were frequent, three to four sessions
            per week during the intense phase.
          </p>
          <p style={{ color: 'var(--color-text-tertiary)' }}>
            Timelines, technical feasibility, and procurement scope were outside
            design ownership.
          </p>

          <p
            className="case-study__label"
            style={{ marginTop: 'var(--space-8)' }}
          >
            What success looked like
          </p>
          <ul className="case-study__list">
            <li className="case-study__list-item">
              <span className="case-study__list-bullet" />
              Fast reuse decisions
            </li>
            <li className="case-study__list-item">
              <span className="case-study__list-bullet" />
              Clear skill structure
            </li>
            <li className="case-study__list-item">
              <span className="case-study__list-bullet" />
              Reduced duplication
            </li>
          </ul>
        </motion.div>
      </section>

      {/* Impact */}
      <section className="case-study__section">
        <motion.div className="case-study__prose" {...revealProps}>
          <p className="case-study__label">Impact</p>
          <p className="case-study__display">
            The new system reduced duplication, improved discoverability, and
            created a foundation where both humans and AI can reason about skills
            consistently.
          </p>
          <p>
            The system became the backbone for how assessments are authored and
            scaled inside the Assessment Engine.
          </p>
        </motion.div>
      </section>

      {/* Password Gate */}
      {!isUnlocked && (
        <section className="case-study__section">
          <div className="case-study__gate">
            <div className="case-study__gate-gradient" />
            <p className="case-study__gate-text">
              This project included detailed iterations, rejected directions, and
              interaction flows designed under tight constraints.
            </p>
            <label htmlFor="gate-password" className="case-study__gate-label">
              Enter password to view the full case study.
            </label>
            <div className="case-study__gate-form">
              <input
                id="gate-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setIsWrong(false)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                placeholder="Password"
                className={`case-study__gate-input${isWrong ? ' case-study__gate-input--error' : ''}`}
              />
              <button onClick={handleUnlock} className="case-study__gate-btn">
                Unlock
              </button>
            </div>
            {isWrong && (
              <p className="case-study__gate-error">Incorrect password.</p>
            )}
          </div>
        </section>
      )}

      {/* Unlocked Content */}
      {isUnlocked && (
        <>
          <section className="case-study__section">
            <motion.div className="case-study__prose" {...revealProps}>
              <p className="case-study__label">Iterations &amp; Rejected Directions</p>
              <p>
                The first three iterations centered on improving the existing
                table: better column ordering, inline skill tags, and contextual
                filters. Each version tested well in isolation but failed when
                SMEs had to cross-reference skills across assessments.
              </p>
              <p>
                A card-based layout was explored next, grouping questions by
                skill cluster. This surfaced relationships better, but introduced
                cognitive load when skills spanned multiple domains.
              </p>
              <p className="case-study__prose--emphasis">
                The breakthrough came from observing that users naturally
                described skills in terms of hierarchy: parent skills, sub-skills,
                and leaf-level questions. The interface needed to match this mental
                model, not abstract over it.
              </p>
            </motion.div>
          </section>

          <section className="case-study__section">
            <motion.div className="case-study__prose" {...revealProps}>
              <p className="case-study__label">Interaction Details</p>
              <p>
                The explorer uses a persistent sidebar with expandable skill
                nodes. Clicking a skill opens a context pane showing its
                description, associated questions, and usage across assessments.
              </p>
              <p>
                Drag-and-drop was considered for reordering skills but removed
                after usability testing showed it conflicted with the taxonomy's
                inherent structure. Instead, skills are positioned via a
                dedicated taxonomy editor available to admins.
              </p>
              <p>
                Question preview cards show type, difficulty, and last-used date
                inline, reducing the need to open separate detail views.
              </p>
            </motion.div>
          </section>

          <section className="case-study__section">
            <motion.div className="case-study__prose" {...revealProps}>
              <p className="case-study__label">Constraints &amp; Trade-offs</p>
              <p>
                The taxonomy depth was capped at four levels to balance
                expressiveness with navigability. Deeper hierarchies were
                supported via tagging, keeping the explorer focused.
              </p>
              <p>
                Full-text search across questions was deprioritized in favor of
                skill-first navigation, a deliberate choice to reinforce the
                mental model shift.
              </p>
              <p>
                The system was designed to be AI-ready from the start: each
                skill node carries structured metadata that downstream models
                can consume for auto-tagging and gap analysis.
              </p>
            </motion.div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="case-study__section">
        <div className="case-study__cta">
          <p className="case-study__cta-heading">Want to see more work?</p>
          <div className="case-study__cta-buttons">
            <Link to="/#work" className="case-study__cta-primary">
              View all projects
            </Link>
            <a
              href="mailto:hello@nischalskanda.com"
              className="case-study__cta-secondary"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <footer className="case-study__footer">
        <div className="case-study__footer-inner">
          <p className="case-study__footer-name">Nischal Skanda</p>
          <nav className="case-study__footer-links">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
