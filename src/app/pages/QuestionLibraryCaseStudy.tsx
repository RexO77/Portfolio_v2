import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { ArrowLeft } from '@/components/icons/ArrowLeft'
import DynamicScrollIslandTOC, {
  type DynamicScrollIslandSection,
} from '@/components/ui/dynamic-scroll-island-toc'
import { questionLibraryCaseStudy as caseStudy } from '@/content/question-library'
import { siteMetadata, socialLinks } from '@/content/site'
import {
  CaseStudyFigure,
  CaseStudyList,
  ReframePanels,
  StatsSection,
} from '@/features/case-study/components'
import { useHaptics } from '@/hooks/use-haptics'
import { useStartupRouteReady } from '@/features/intro/useStartupRouteReady'
import '@/styles/case-study.css'

const caseStudySmoothEase = [0.4, 0, 0.2, 1] as const

const caseStudyRevealProps = {
  initial: { opacity: 0, y: 16 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-80px' } as const,
  transition: { duration: 0.5, ease: caseStudySmoothEase } as const,
}

const CASE_STUDY_SECTION_IDS = {
  overview: 'case-study-overview',
  context: 'case-study-context',
  problem: 'case-study-problem',
  whyItMattered: 'case-study-why-it-mattered',
  obviousFix: 'case-study-obvious-fix',
  reframe: 'case-study-reframe',
  system: 'case-study-system',
  ownership: 'case-study-ownership',
  impact: 'case-study-impact',
  cta: 'case-study-next-steps',
} as const

function getDetailSectionId(index: number) {
  return `case-study-detail-${index + 1}`
}

export default function QuestionLibraryCaseStudy() {
  const { haptic } = useHaptics()

  useStartupRouteReady()

  const tocSections = useMemo<DynamicScrollIslandSection[]>(
    () => [
      { id: CASE_STUDY_SECTION_IDS.overview, name: 'Overview' },
      { id: CASE_STUDY_SECTION_IDS.context, name: caseStudy.context.label },
      { id: CASE_STUDY_SECTION_IDS.problem, name: caseStudy.problem.label },
      {
        id: CASE_STUDY_SECTION_IDS.whyItMattered,
        name: caseStudy.whyItMattered.label,
      },
      { id: CASE_STUDY_SECTION_IDS.obviousFix, name: caseStudy.obviousFix.label },
      { id: CASE_STUDY_SECTION_IDS.reframe, name: caseStudy.reframe.label },
      { id: CASE_STUDY_SECTION_IDS.system, name: caseStudy.system.label },
      { id: CASE_STUDY_SECTION_IDS.ownership, name: caseStudy.ownership.label },
      { id: CASE_STUDY_SECTION_IDS.impact, name: caseStudy.impact.label },
      ...caseStudy.detailSections.map((section, index) => ({
        id: getDetailSectionId(index),
        name: section.label,
      })),
      { id: CASE_STUDY_SECTION_IDS.cta, name: 'Next Steps' },
    ],
    [],
  )

  return (
    <>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="case-study case-study--question-library"
      >
      <section
        id={CASE_STUDY_SECTION_IDS.overview}
        className="case-study__section case-study__section--hero case-study__nav-target"
      >
        <motion.div {...caseStudyRevealProps}>
          <Link
            to="/#work"
            className="case-study__back"
            onClick={() => {
              haptic('nav')
            }}
          >
            <ArrowLeft /> {caseStudy.hero.backLabel}
          </Link>

          <h1 className="case-study__title">{caseStudy.hero.title}</h1>
          <p className="case-study__subtitle">{caseStudy.hero.subtitle}</p>

          <div className="case-study__meta">
            {caseStudy.hero.meta.map((item) => (
              <span key={item.label}>
                <span className="case-study__meta-label">{item.label}:</span>{' '}
                {item.value}
              </span>
            ))}
          </div>

          <p className="case-study__shipped">
            <span className="case-study__shipped-label">Shipped:</span>{' '}
            {caseStudy.hero.shipped}
          </p>
        </motion.div>
      </section>

      <section className="case-study__hero-image">
        <motion.div {...caseStudyRevealProps}>
          <CaseStudyFigure
            image={caseStudy.hero.image}
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.context}
        className="case-study__section case-study__nav-target"
      >
        <motion.div className="case-study__prose" {...caseStudyRevealProps}>
          <p className="case-study__label">{caseStudy.context.label}</p>
          {caseStudy.context.paragraphs.slice(0, -1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="case-study__prose--emphasis">
            {caseStudy.context.paragraphs.at(-1)}
          </p>
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.problem}
        className="case-study__section case-study__nav-target"
      >
        <motion.div className="case-study__grid" {...caseStudyRevealProps}>
          <div>
            <p className="case-study__label">{caseStudy.problem.label}</p>
            <h3 className="case-study__subheading">{caseStudy.problem.heading}</h3>
            {caseStudy.problem.paragraphs.slice(0, -1).map((paragraph) => (
              <p key={paragraph} className="case-study__body">
                {paragraph}
              </p>
            ))}
            <p className="case-study__body case-study__body--emphasis">
              {caseStudy.problem.paragraphs.at(-1)}
            </p>
            <CaseStudyList items={caseStudy.problem.bullets} />
          </div>

          <CaseStudyFigure
            image={caseStudy.problem.image}
            className="case-study__figure"
          />
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.whyItMattered}
        className="case-study__section case-study__section--surface case-study__nav-target"
      >
        <motion.div className="case-study__section-inner" {...caseStudyRevealProps}>
          <p className="case-study__label">{caseStudy.whyItMattered.label}</p>
          <p className="case-study__body" style={{ maxWidth: '42rem' }}>
            {caseStudy.whyItMattered.intro}
          </p>
          <StatsSection stats={caseStudy.whyItMattered.stats} />
          <p className="case-study__body case-study__body--muted case-study__body--sm">
            {caseStudy.whyItMattered.note}
          </p>
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.obviousFix}
        className="case-study__section case-study__nav-target"
      >
        <motion.div {...caseStudyRevealProps}>
          <div className="case-study__prose">
            <p className="case-study__label">{caseStudy.obviousFix.label}</p>
            <p>{caseStudy.obviousFix.paragraphs[0]}</p>
            <p className="case-study__prose--emphasis">
              {caseStudy.obviousFix.paragraphs[1]}
            </p>
          </div>

          <CaseStudyFigure
            image={caseStudy.obviousFix.image}
            className="case-study__figure"
          />
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.reframe}
        className="case-study__section case-study__nav-target"
      >
        <motion.div className="case-study__grid" {...caseStudyRevealProps}>
          <div>
            <p className="case-study__label">{caseStudy.reframe.label}</p>
            <p className="case-study__display">{caseStudy.reframe.display}</p>
            <p className="case-study__body">{caseStudy.reframe.paragraphs[0]}</p>
            <p className="case-study__body case-study__body--emphasis">
              {caseStudy.reframe.paragraphs[1]}
            </p>
            <CaseStudyList
              items={caseStudy.reframe.bullets}
              className="case-study__list case-study__list--spaced"
            />
          </div>

          <ReframePanels reframe={caseStudy.reframe} />
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.system}
        className="case-study__section case-study__nav-target"
      >
        <motion.div {...caseStudyRevealProps}>
          <p className="case-study__label">{caseStudy.system.label}</p>
          <p
            className="case-study__body"
            style={{ maxWidth: '48rem', marginTop: 'var(--space-6)' }}
          >
            {caseStudy.system.paragraphs[0]}
          </p>
          <p
            className="case-study__body case-study__body--emphasis"
            style={{ maxWidth: '48rem' }}
          >
            {caseStudy.system.paragraphs[1]}
          </p>

          <CaseStudyFigure
            image={caseStudy.system.image}
            className="case-study__figure"
          />
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.ownership}
        className="case-study__section case-study__section--surface case-study__nav-target"
      >
        <motion.div
          className="case-study__section-inner case-study__prose"
          {...caseStudyRevealProps}
        >
          <p className="case-study__label">{caseStudy.ownership.label}</p>
          <p>{caseStudy.ownership.paragraphs[0]}</p>
          <p>{caseStudy.ownership.paragraphs[1]}</p>
          <p style={{ color: 'var(--color-text-tertiary)' }}>
            {caseStudy.ownership.paragraphs[2]}
          </p>

          <p className="case-study__label" style={{ marginTop: 'var(--space-8)' }}>
            {caseStudy.ownership.successLabel}
          </p>
          <CaseStudyList items={caseStudy.ownership.successBullets} />
        </motion.div>
      </section>

      <section
        id={CASE_STUDY_SECTION_IDS.impact}
        className="case-study__section case-study__nav-target"
      >
        <motion.div className="case-study__prose" {...caseStudyRevealProps}>
          <p className="case-study__label">{caseStudy.impact.label}</p>
          <p className="case-study__display">{caseStudy.impact.display}</p>
          {caseStudy.impact.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {caseStudy.impact.image ? (
            <CaseStudyFigure
              image={caseStudy.impact.image}
              className="case-study__figure"
            />
          ) : null}
        </motion.div>
      </section>

      {caseStudy.detailSections.map((section, sectionIndex) => (
        <section
          key={section.label}
          id={getDetailSectionId(sectionIndex)}
          className="case-study__section case-study__nav-target"
        >
          <motion.div className="case-study__prose" {...caseStudyRevealProps}>
            <p className="case-study__label">{section.label}</p>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p
                key={paragraph}
                className={
                  sectionIndex === 0 &&
                  paragraphIndex === section.paragraphs.length - 1
                    ? 'case-study__prose--emphasis'
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
            {section.image ? (
              <CaseStudyFigure image={section.image} className="case-study__figure" />
            ) : null}
          </motion.div>
        </section>
      ))}

      <section
        id={CASE_STUDY_SECTION_IDS.cta}
        className="case-study__section case-study__nav-target"
      >
        <div className="case-study__cta">
          <p className="case-study__cta-heading">{caseStudy.cta.heading}</p>
          <div className="case-study__cta-buttons">
            <Link
              to={caseStudy.cta.primaryTo}
              className="case-study__cta-primary"
              onClick={() => {
                haptic('primary')
              }}
            >
              {caseStudy.cta.primaryLabel}
            </Link>
            <a
              href={caseStudy.cta.secondaryHref}
              className="case-study__cta-secondary"
              onClick={() => {
                haptic('click')
              }}
            >
              {caseStudy.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <footer className="case-study__footer">
        <div className="case-study__footer-inner">
          <p className="case-study__footer-name">{siteMetadata.name}</p>
          <nav className="case-study__footer-links">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>

      <DynamicScrollIslandTOC
        sections={tocSections}
        containerSelector=".scroll-root"
        layoutIdPrefix="question-library-case-study"
      />
      </main>
    </>
  )
}
