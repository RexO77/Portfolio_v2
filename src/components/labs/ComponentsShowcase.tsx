import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { ConnectDropdown } from '@/components/ConnectDropdown'
import { useInViewOnce } from '@/hooks/viewport'

import { InteractionShowcase } from './InteractionShowcase'
import { ScribbleUnderline } from './ScribbleUnderline'
import { StickyNote } from './StickyNote'
import {
  TextHighlighter,
  type TextHighlighterRef,
} from './TextHighlighter'

interface LabsShowcaseItem {
  id: string
  title: string
  description: string
  code: string
  language?: string
  render: () => ReactNode
}

function HandwrittenHighlightDemo() {
  const [animationKey, setAnimationKey] = useState(0)

  return (
    <div className="labs-highlight-demo">
      <h3 className="labs-highlight-demo__title">
        Text{' '}
        <span
          key={animationKey}
          className="labs-handwritten-highlight labs-handwritten-highlight--animate"
          data-text="Highlight"
          style={{ '--highlight-color': '#b8efb4' } as CSSProperties}
          onClick={() => {
            setAnimationKey((value) => value + 1)
          }}
          title="Click to replay"
        >
          Highlight
        </span>
      </h3>

      <button
        type="button"
        className="labs-replay-button"
        onClick={() => {
          setAnimationKey((value) => value + 1)
        }}
      >
        Replay
      </button>
    </div>
  )
}

function TextHighlighterDemo() {
  const highlighterRef = useRef<TextHighlighterRef>(null)
  const { ref: demoRef, inView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.45,
  })

  useEffect(() => {
    if (!inView) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      highlighterRef.current?.reset()
      highlighterRef.current?.animate()
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [inView])

  const replay = () => {
    highlighterRef.current?.reset()

    window.setTimeout(() => {
      highlighterRef.current?.animate()
    }, 100)
  }

  return (
    <div ref={demoRef} className="labs-highlight-demo">
      <p className="labs-text-highlighter-demo__copy">
        Products built on{' '}
        <TextHighlighter
          ref={highlighterRef}
          highlightColor="#ffe4b8"
          triggerType="ref"
        >
          solid research
        </TextHighlighter>
      </p>

      <button type="button" className="labs-replay-button" onClick={replay}>
        Replay
      </button>
    </div>
  )
}

const codeSnippets = {
  scribbleUnderline: `import { useState } from 'react'

type ScribbleUnderlineProps = {
  children: React.ReactNode
  color?: string
}

export function ScribbleUnderline({
  children,
  color = '#1d4ed8',
}: ScribbleUnderlineProps) {
  const [isHovered, setIsHovered] = useState(false)
  const dashOffset = isHovered ? 0 : 100

  return (
    <span
      className="scribble-underline"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}
      <svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none">
        <defs>
          <filter id="scribble-wobble" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              baseFrequency="0.04 0.08"
              numOctaves="2"
              result="turbulence"
              seed="1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="1.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <path
          d="M2,14 Q18,18 34,14 T66,14 T98,14"
          pathLength={100}
          style={{
            fill: 'none',
            stroke: color,
            strokeWidth: 6,
            strokeLinecap: 'round',
            filter: 'url(#scribble-wobble)',
            strokeDasharray: 100,
            strokeDashoffset: dashOffset,
            transition: 'stroke-dashoffset 650ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>
    </span>
  )
}

export function Demo() {
  return (
    <h2>
      <ScribbleUnderline>Design with purpose</ScribbleUnderline>
    </h2>
  )
}

.scribble-underline {
  position: relative;
  display: inline-block;
  padding-bottom: 0.15em;
}

.scribble-underline svg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 0.7em;
  pointer-events: none;
  overflow: visible;
}`,

  handwrittenHighlight: `import { useState } from 'react'

export function HandwrittenHighlightDemo() {
  const [animationKey, setAnimationKey] = useState(0)
  const replay = () => setAnimationKey((value) => value + 1)

  return (
    <div className="highlight-demo">
      <h2>
        Text{' '}
        <span
          key={animationKey}
          className="handwritten-highlight animate-highlight"
          data-text="Highlight"
          style={{ '--highlight-color': '#b8efb4' } as React.CSSProperties}
          onClick={replay}
          title="Click to replay"
        >
          Highlight
        </span>
      </h2>

      <button type="button" onClick={replay}>
        Replay
      </button>
    </div>
  )
}

.handwritten-highlight {
  position: relative;
  display: inline-block;
  z-index: 1;
  font-style: italic;
  font-weight: 700;
  cursor: pointer;
}

.animate-highlight::before {
  content: '';
  position: absolute;
  top: 15%;
  left: -3%;
  width: 106%;
  height: 70%;
  background: var(--highlight-color, #ffe066);
  opacity: 0.85;
  transform: scaleX(0) rotate(-0.5deg);
  transform-origin: left center;
  z-index: -1;
  clip-path: polygon(
    2% 25%, 12% 18%, 28% 22%, 48% 15%, 68% 20%,
    85% 12%, 98% 18%, 96% 78%, 88% 85%, 72% 80%,
    52% 88%, 32% 82%, 15% 90%, 4% 82%
  );
  animation: natural-hand-highlight 0.9s linear forwards;
}

.animate-highlight::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 2;
  animation: highlight-text-appear 0.9s linear forwards;
  animation-delay: 0.16s;
}

@keyframes natural-hand-highlight {
  0% { transform: scaleX(0) rotate(-1deg) skewX(-3deg); opacity: 0.3; }
  45% { transform: scaleX(0.6) rotate(-0.5deg) skewX(-1deg); opacity: 0.75; }
  100% { transform: scaleX(1) rotate(0deg) skewX(0deg); opacity: 0.85; }
}

@keyframes highlight-text-appear {
  from { opacity: 0; transform: translateY(1px); }
  to { opacity: 1; transform: translateY(0); }
}`,

  textHighlighter: `import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { motion } from 'motion/react'

type TextHighlighterRef = {
  animate: () => void
  reset: () => void
}

type TextHighlighterProps = {
  children: ReactNode
  highlightColor?: string
}

export const TextHighlighter = forwardRef<
  TextHighlighterRef,
  TextHighlighterProps
>(function TextHighlighter(
  { children, highlightColor = '#ffe4b8' },
  ref,
) {
  const [isActive, setIsActive] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  useImperativeHandle(ref, () => ({
    animate: () => setIsActive(true),
    reset: () => {
      setIsActive(false)
      setResetKey((value) => value + 1)
    },
  }))

  return (
    <motion.span
      key={resetKey}
      className="text-highlighter"
      initial={{ backgroundSize: '0% 100%' }}
      animate={{ backgroundSize: isActive ? '100% 100%' : '0% 100%' }}
      transition={{ type: 'spring', duration: 1, bounce: 0 }}
      style={{
        backgroundImage: 'linear-gradient(' + highlightColor + ', ' + highlightColor + ')',
      }}
    >
      {children}
    </motion.span>
  )
})

export function Demo() {
  const ref = useRef<TextHighlighterRef>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => ref.current?.animate(), 300)
    return () => window.clearTimeout(timer)
  }, [])

  const replay = () => {
    ref.current?.reset()
    window.setTimeout(() => ref.current?.animate(), 100)
  }

  return (
    <div>
      <p>
        Products built on{' '}
        <TextHighlighter ref={ref}>solid research</TextHighlighter>
      </p>
      <button type="button" onClick={replay}>Replay</button>
    </div>
  )
}

.text-highlighter {
  display: inline;
  padding-inline: 0.04em;
  background-repeat: no-repeat;
  background-position: 0% 0%;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}`,

  stickyNote: `import { useEffect, useRef, useState } from 'react'

type StickyNoteProps = {
  children: React.ReactNode
  color?: string
  rotate?: 'left' | 'right' | 'none'
}

export function StickyNote({
  children,
  color = '#fef08a',
  rotate = 'none',
}: StickyNoteProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasPeeled, setHasPeeled] = useState(false)
  const [isPeeling, setIsPeeling] = useState(false)
  const rotation =
    rotate === 'left' ? '-2deg' : rotate === 'right' ? '2deg' : '0deg'

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasPeeled) return
      setHasPeeled(true)
      setIsPeeling(true)
    }, { threshold: 0.35 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasPeeled])

  return (
    <div ref={ref} className="sticky-note-shell">
      <div className="sticky-note-tape" aria-hidden="true" />
      <div
        className={isPeeling ? 'sticky-note peel-animate' : 'sticky-note'}
        style={{
          '--note-bg': color,
          '--note-rotation': rotation,
        } as React.CSSProperties}
        onAnimationEnd={() => setIsPeeling(false)}
      >
        {children}
      </div>
    </div>
  )
}

export function Demo() {
  return (
    <div className="sticky-note-demo">
      <StickyNote rotate="left">UX Research</StickyNote>
      <StickyNote color="#bbf7d0" rotate="right">Visual Design</StickyNote>
    </div>
  )
}

.sticky-note-shell {
  position: relative;
}

.sticky-note-tape {
  position: absolute;
  top: -0.35rem;
  left: 50%;
  z-index: 2;
  width: 3rem;
  height: 1rem;
  border: 1px solid rgba(254, 240, 138, 0.72);
  border-radius: 0.2rem;
  background: rgba(254, 240, 138, 0.8);
  transform: translateX(-50%) rotate(-12deg);
  transition: transform 150ms ease-out;
}

.sticky-note {
  width: 7rem;
  min-height: 7rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  border: 1px solid rgba(30, 30, 30, 0.12);
  border-radius: 0.75rem;
  background: var(--note-bg);
  transform: rotate(var(--note-rotation));
  transition: transform 150ms ease-out, border-color 150ms ease-out;
}

.sticky-note-shell:hover .sticky-note {
  border-color: rgba(30, 30, 30, 0.28);
  transform: rotate(var(--note-rotation)) translateY(-4px) scale(1.03);
}

.sticky-note-shell:hover .sticky-note-tape {
  transform: translateX(-50%) translateY(-0.12rem) rotate(-8deg);
}

.peel-animate {
  animation: peel-note 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  transform-origin: top center;
}

@keyframes peel-note {
  0% { transform: rotate(var(--note-rotation)) perspective(600px) rotateX(0deg); }
  40% { transform: rotate(var(--note-rotation)) perspective(600px) rotateX(-12deg) translateY(4px); }
  100% { transform: rotate(var(--note-rotation)) perspective(600px) rotateX(0deg); }
}`,

  daisyButton: `export function DaisyButtonDemo() {
  return (
    <a
      href="#contact"
      className="daisy-button"
      onClick={(event) => event.preventDefault()}
    >
      <span>Let's work together</span>
      <span aria-hidden="true">→</span>
    </a>
  )
}

.daisy-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 2px solid #000;
  border-radius: 0;
  background: #a2ff86;
  color: #000;
  box-shadow: 4px 4px 0 0 #000;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition:
    transform 150ms ease-out,
    box-shadow 150ms ease-out,
    background-color 150ms ease-out;
}

.daisy-button:hover,
.daisy-button:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 #000;
  background: #fff;
}`,

  dropdown: `import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const links = [
  { label: 'Email', href: 'mailto:hello@example.com' },
  { label: 'GitHub', href: 'https://github.com/yourname' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname' },
]

export function ConnectDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="connect-dropdown">
      <button
        type="button"
        className="connect-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        Let's chat
        <span aria-hidden="true">⌄</span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="connect-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {links.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

.connect-dropdown {
  position: relative;
  display: inline-block;
}

.connect-trigger,
.connect-menu a {
  border: 1px solid rgba(30, 30, 30, 0.14);
  background: #fffdf4;
  color: #1e1e1e;
}

.connect-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
}

.connect-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  display: grid;
  min-width: 12rem;
  padding: 0.35rem;
  border: 1px solid rgba(30, 30, 30, 0.14);
  border-radius: 1rem;
  background: #fffdf4;
}

.connect-menu a {
  padding: 0.7rem 0.8rem;
  border-radius: 0.75rem;
  text-decoration: none;
}`,
}

const showcaseItems: LabsShowcaseItem[] = [
  {
    id: 'scribble-underline',
    title: 'Scribble Underline',
    description: 'Hand-drawn style underline with an SVG wobble filter.',
    code: codeSnippets.scribbleUnderline,
    render: () => (
      <div className="labs-scribble-demo">
        <h3 className="labs-scribble-demo__title">
          <ScribbleUnderline trigger="hover" color="#1d4ed8">
            Design with purpose
          </ScribbleUnderline>
        </h3>
      </div>
    ),
  },
  {
    id: 'handwritten-highlight',
    title: 'Handwritten Highlight',
    description: 'Marker-style highlight with layered CSS transforms.',
    code: codeSnippets.handwrittenHighlight,
    render: () => <HandwrittenHighlightDemo />,
  },
  {
    id: 'text-highlighter',
    title: 'Text Highlighter',
    description: 'Animated marker effect triggered on demand.',
    code: codeSnippets.textHighlighter,
    render: () => <TextHighlighterDemo />,
  },
  {
    id: 'sticky-note',
    title: 'Sticky Note',
    description: 'Interactive notes with tape detail and a peel-on-entry motion.',
    code: codeSnippets.stickyNote,
    render: () => (
      <div className="labs-sticky-note-demo">
        <StickyNote
          content="UX Research"
          color="yellow"
          rotate="left"
          pinType="tape"
          className="labs-sticky-note-demo__note"
        />
        <StickyNote
          content="Visual Design"
          color="mint"
          rotate="right"
          pinType="tape"
          className="labs-sticky-note-demo__note"
        />
      </div>
    ),
  },
  {
    id: 'daisy-button',
    title: 'Daisy Button',
    description: 'Neo-brutalist press effect with a crisp shadow drop.',
    code: codeSnippets.daisyButton,
    render: () => (
      <div className="labs-button-demo">
        <a
          href="#"
          className="labs-daisy-button"
          onClick={(event) => {
            event.preventDefault()
          }}
        >
          <span>Let&apos;s work together</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    ),
  },
  {
    id: 'connect-dropdown',
    title: 'Connect Dropdown',
    description: 'The live navbar dropdown, staged inside the Labs preview surface.',
    code: codeSnippets.dropdown,
    render: () => (
      <div className="labs-dropdown-demo">
        <div className="labs-dropdown-demo__surface">
          <ConnectDropdown />
        </div>
      </div>
    ),
  },
]

interface ComponentsShowcaseProps {
  className?: string
}

export function ComponentsShowcase({ className }: ComponentsShowcaseProps) {
  const rootClassName = className
    ? `labs-components-showcase ${className}`
    : 'labs-components-showcase'

  return (
    <div className={rootClassName}>
      {showcaseItems.map((item) => (
        <div key={item.id}>
          <InteractionShowcase
            id={item.id}
            title={item.title}
            description={item.description}
            code={item.code}
            language={item.language}
          >
            {item.render()}
          </InteractionShowcase>
        </div>
      ))}
    </div>
  )
}

export default ComponentsShowcase
