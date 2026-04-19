import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import NumberTicker from '@/components/fancy/NumberTicker'
import { useHaptics } from '@/hooks/use-haptics'
import type { CaseStudyContent, CaseStudyImage } from '@/types/content'

const caseStudySmoothEase = [0.4, 0, 0.2, 1] as const

interface CaseStudyFigureProps {
  image?: CaseStudyImage
  className?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'auto' | 'high' | 'low'
}

export function CaseStudyFigure({
  image,
  className,
  loading = 'lazy',
  fetchPriority = 'auto',
}: CaseStudyFigureProps) {
  if (!image) {
    return null
  }

  return (
    <figure className={className}>
      <img
        src={image.src}
        alt={image.alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
      />
      <figcaption className="case-study__figcaption">{image.caption}</figcaption>
    </figure>
  )
}

export function CaseStudyList({
  items,
  className,
}: {
  items?: string[]
  className?: string
}) {
  if (!items?.length) {
    return null
  }

  return (
    <ul className={className ?? 'case-study__list'}>
      {items.map((item) => (
        <li key={item} className="case-study__list-item">
          <span className="case-study__list-bullet" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function StatsSection({
  stats,
}: {
  stats: CaseStudyContent['whyItMattered']['stats']
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="case-study__stats">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.description}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.15 * index }}
        >
          <p className="case-study__stat-value">
            {stat.prefix}
            <NumberTicker
              from={stat.from}
              target={stat.target}
              autoStart={isInView}
              transition={{ duration: 2.2, ease: caseStudySmoothEase }}
            />
            {stat.suffix}
          </p>
          <p className="case-study__stat-desc">{stat.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

export function ReframePanels({
  reframe,
}: {
  reframe: CaseStudyContent['reframe']
}) {
  return (
    <figure>
      <div
        className="case-study__panels"
        role="img"
        aria-label="From rows and tags to hierarchy and context"
      >
        <motion.div
          className="case-study__panel"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: caseStudySmoothEase }}
        >
          <p className="case-study__panel-title">Rows + Tags</p>
          <div className="case-study__panel-rows">
            {reframe.rows.map((row, index) => (
              <div key={`${row.q}-${row.tag}`} className="case-study__panel-row">
                <motion.span
                  className={`case-study__panel-question${
                    row.dim ? ' case-study__panel-question--dim' : ''
                  }`}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 * index,
                    ease: caseStudySmoothEase,
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
                    delay: 0.5 + 0.08 * index,
                    ease: caseStudySmoothEase,
                  }}
                >
                  {row.tag}
                </motion.span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="case-study__panel"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15, ease: caseStudySmoothEase }}
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
                  ease: caseStudySmoothEase,
                }}
              >
                ▾
              </motion.span>
              {reframe.tree.root}
            </div>

            <motion.div
              className="case-study__tree-children"
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: 'auto', opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.55,
                ease: caseStudySmoothEase,
              }}
            >
              {reframe.tree.branches.map((branch, branchIndex) =>
                branch.leaves ? (
                  <div key={branch.name}>
                    <div className="case-study__tree-folder">
                      <motion.span
                        className="case-study__tree-chevron"
                        initial={{ rotate: -90 }}
                        whileInView={{ rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: 0.75 + branchIndex * 0.15,
                          ease: caseStudySmoothEase,
                        }}
                      >
                        ▾
                      </motion.span>
                      {branch.name}
                    </div>

                    <motion.div
                      className="case-study__tree-children"
                      initial={{ height: 0, opacity: 0 }}
                      whileInView={{ height: 'auto', opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.9 + branchIndex * 0.15,
                        ease: caseStudySmoothEase,
                      }}
                    >
                      {branch.leaves.map((name, leafIndex) => (
                        <motion.div
                          key={name}
                          className="case-study__tree-leaf"
                          initial={{ opacity: 0, x: -6 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.35,
                            delay: 1 + leafIndex * 0.1,
                            ease: caseStudySmoothEase,
                          }}
                        >
                          <span className="case-study__tree-dot" /> {name}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    key={branch.name}
                    className="case-study__tree-folder"
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: 1.2 + branchIndex * 0.1,
                      ease: caseStudySmoothEase,
                    }}
                  >
                    <span className="case-study__tree-chevron">▸</span> {branch.name}
                  </motion.div>
                ),
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <figcaption className="case-study__figcaption">{reframe.panelsCaption}</figcaption>
    </figure>
  )
}

interface PasswordGateProps {
  gate: CaseStudyContent['gate']
  password: string
  isWrong: boolean
  onPasswordChange: (password: string) => void
  onUnlock: () => 'success' | 'error' | 'off'
}

export function PasswordGate({
  gate,
  password,
  isWrong,
  onPasswordChange,
  onUnlock,
}: PasswordGateProps) {
  const { haptic } = useHaptics()

  return (
    <div className="case-study__gate">
      <div className="case-study__gate-gradient" />
      <p className="case-study__gate-text">{gate.description}</p>
      <label htmlFor="gate-password" className="case-study__gate-label">
        {gate.label}
      </label>
      <div className="case-study__gate-form">
        <input
          id="gate-password"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onUnlock()
            }
          }}
          placeholder={gate.placeholder}
          className={`case-study__gate-input${
            isWrong ? ' case-study__gate-input--error' : ''
          }`}
        />
        <button
          type="button"
          onClick={() => {
            haptic(onUnlock())
          }}
          className="case-study__gate-btn"
        >
          {gate.buttonLabel}
        </button>
      </div>
      {isWrong ? <p className="case-study__gate-error">{gate.errorMessage}</p> : null}
    </div>
  )
}
