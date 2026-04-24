import { featuredProjects } from '@/content/projects'
import { siteMetadata } from '@/content/site'
import type { CaseStudyContent } from '@/types/content'

const summary =
  featuredProjects.find((project) => project.id === 'login-redesign') ??
  featuredProjects[0]

export const loginRedesignCaseStudy: CaseStudyContent = {
  summary,
  hero: {
    backLabel: 'Back to projects',
    title: 'Redesigning login from a fragmented flow into a measurable system',
    subtitle:
      'Reduced friction across authentication by simplifying flows, standardizing feedback, and instrumenting the journey.',
    meta: [
      { label: 'Role', value: 'Product Design Engineer' },
      { label: 'Scope', value: 'End-to-end auth flow' },
      { label: 'Timeline', value: '3–4 weeks' },
      { label: 'Stakeholders', value: 'CTO, PM, Frontend Engineer' },
    ],
    shipped: 'Email → Verification → Account → Method flow + funnel instrumentation',
    image: {
      src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1800&h=1200&fit=crop',
      alt: 'Final login screen with left form panel and right illustration',
      caption: 'Final login flow — clear hierarchy, single primary action per state',
    },
  },
  context: {
    label: 'Context',
    paragraphs: [
      'Talview is a B2B HR-tech platform. Login is the gate to everything: assessments, proctoring, interviews, and reports. Every recruiter, candidate, and admin passes through it.',
      'On the surface, authentication worked. Underneath, it was three problems stacked on top of each other: unclear UI, a multi-tenant + OTP architecture with real latency, and zero measurement of where users actually dropped off.',
      'The first question was not how to redesign the screen. It was: where exactly does login break?',
    ],
  },
  problem: {
    label: 'The Problem',
    heading: 'Login was leaking users silently',
    paragraphs: [
      'Authentication was not failing in any obvious way. No errors in logs, no spike in support tickets that anyone could attribute back to a single screen.',
      'But users were dropping off mid-flow, retrying through different paths, or asking support to help them in. The flow had grown step by step over years, and no one could point to where it actually broke.',
      'Most importantly, we had no way to measure where users were dropping off.',
    ],
    bullets: [
      'No reliable recovery path',
      'Inconsistent validation and feedback',
      'High friction in multi-tenant selection',
      'OTP-based verification adding latency and context switching',
      'No instrumentation across the funnel',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop',
      alt: 'Annotated screenshot of the legacy login flow with friction points highlighted',
      caption: 'Old flow, annotated — duplicate paths, missing states, unclear actions',
    },
  },
  whyItMattered: {
    label: 'Why This Mattered',
    intro:
      'Login is not a screen. It is the funnel that decides whether the rest of the product exists for a user. Without measurement, every assumption about it was a guess.',
    stats: [
      {
        from: 0,
        target: 4,
        suffix: ' steps',
        description: 'instrumented across the auth funnel for the first time',
      },
      {
        from: 3,
        target: 1,
        suffix: ' min',
        description: 'perceived login time reframed once OTP latency was measured',
      },
      {
        from: 0,
        target: 100,
        suffix: '%',
        description: 'visibility into UI vs system bottlenecks post-instrumentation',
      },
    ],
    note:
      'Numbers are directional and reflect funnel visibility gained, not redacted internal metrics.',
  },
  obviousFix: {
    label: 'What the Obvious Fix Missed',
    paragraphs: [
      'The first instinct was visual: cleaner form, tighter copy, a fresh illustration on the right.',
      'It would have shipped, looked better, and changed nothing. The flow was still unmeasured, the OTP latency was still invisible, and the multi-tenant selection still broke at scale.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=800&fit=crop',
      alt: 'Early visual-only redesign exploration of the login form',
      caption: 'V1 polished the surface, but the structural problems stayed',
    },
  },
  reframe: {
    label: 'The Reframe',
    display: 'Login is a measurable funnel, not a single screen.',
    paragraphs: [
      'The shift was treating login as a system: a sequence of discrete steps, each with its own success rate, latency, and failure mode.',
      'Once that frame was set, the redesign followed naturally — clear steps, consistent feedback, capped choices, and instrumentation at every boundary.',
    ],
    bullets: [
      'Simplify the flow into clear steps',
      'Standardize validation and error states',
      'Reduce decision overload at every step',
      'Design around constraints, not against them',
      'Instrument every step for measurement',
    ],
    rows: [
      { q: 'Email then password then OTP then tenant', tag: 'Before' },
      { q: 'Email → Verification → Account → Method', tag: 'After' },
      { q: 'Inconsistent validation, ambiguous CTAs', tag: 'Before' },
      { q: 'Single CTA per terminal state', tag: 'After', dim: true },
    ],
    panelsCaption: 'From an unmeasured screen to a measurable, step-based system',
    tree: {
      root: 'Login',
      branches: [
        {
          name: 'Email',
          leaves: ['Validation', 'Recovery'],
        },
        {
          name: 'Verification',
          leaves: ['OTP', 'Resend'],
        },
        {
          name: 'Account',
          leaves: ['Capped to 4', 'Scroll for overflow'],
        },
        {
          name: 'Method',
          collapsed: true,
        },
      ],
    },
  },
  system: {
    label: 'The System',
    paragraphs: [
      'The shipped flow is four steps: Email → Verification → Account → Method. Every step has standardized validation, a single primary action, and a defined recovery path. The account selection caps visible options at four; overflow scrolls without shifting layout. Icons appear only for directional actions like back; everything else stays text.',
      'OTP latency was treated as a system constraint rather than something to disguise. The UI optimizes for clarity around the wait, not for the illusion of speed.',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
      alt: 'Final shipped login system showing the four-step flow with consistent layout',
      caption: 'Structure does the work, the interface stays quiet',
    },
  },
  ownership: {
    label: 'My Role & Ownership',
    paragraphs: [
      'I owned the end-to-end design: flow structure, decision framework, validation patterns, error states, and the instrumentation spec handed to engineering.',
      'Worked closely with the CTO on architectural constraints, with the PM on scope and rollout, and with a frontend engineer on implementation and analytics events.',
      'OTP provider, backend latency, and security policy were outside design ownership and were treated as constraints to design around.',
    ],
    successLabel: 'What success looked like',
    successBullets: [
      'A flow with full funnel visibility',
      'Bottlenecks attributed to UI vs system, not guessed',
      'Lower reliance on support to recover users',
    ],
  },
  impact: {
    label: 'Impact',
    display:
      'Login became a measurable system instead of a guessing game.',
    paragraphs: [
      'Before: an unclear flow with no measurement and high reliance on support to unblock users.',
      'After: a structured, predictable flow with full funnel visibility and a clear separation between UI issues and system latency.',
    ],
  },
  detailSections: [
    {
      label: 'Decisions & Trade-offs',
      paragraphs: [
        'Terminal states use a single action. Reset success and logout each have one clear CTA. This avoids conflicting navigation and removes ambiguity about what happens next.',
        'Account selection is capped at four visible items. Beyond four, scanning slows down sharply; scroll handles overflow without shifting layout or breaking visual rhythm.',
        'Icons are reserved for directional actions like back. Everything else stays text-based, which keeps the interface readable and accessible without relying on shared icon vocabulary.',
        'Consistency over cleverness. The same layout structure carries across every auth state — no new patterns introduced for edge cases. This made the system easier to reason about for users and for the engineers extending it.',
        'Trade-off: used existing components instead of building new ones. Faster to ship, slightly less visual polish — the right call given timeline and scope.',
        'Trade-off: accepted OTP latency as a system constraint. Designed for clarity around the wait instead of using skeletons or progress illusions to fake speed.',
        'Trade-off: reduced illustrations and visual flair. Prioritized readability and accessibility on a screen every user has to pass through.',
      ],
    },
    {
      label: 'Measurement & Insights',
      paragraphs: [
        'The entire flow was instrumented in Mixpanel: email entry, verification, account selection, login method. Each step tracked enter, exit, success, error, and time spent.',
        'The headline number looked bad: total login time of two to three minutes. Breaking it down told a different story — UI interaction time was under ten seconds per step. OTP wait dominated the rest.',
        'The bottleneck was not UI. It was system latency and context switching. That single insight reframed the rest of the roadmap.',
      ],
    },
    {
      label: 'Learnings & Next Steps',
      paragraphs: [
        'Not all slow experiences are UI problems. Without measurement, the wrong thing gets redesigned.',
        'Measurement changes how the problem is defined. Instrumentation was the highest-leverage decision in the project.',
        'Consistency matters more than visual polish in system flows. Designing within constraints is more impactful than trying to remove them.',
        'Next: improve the OTP experience with auto-fill and clearer guidance during the wait. Explore alternative verification methods to reduce dependency on OTP. Optimize for returning users by skipping steps where state can be trusted. Iterate based on real funnel data, not assumption.',
      ],
    },
  ],
  cta: {
    heading: 'Want to see more work?',
    primaryLabel: 'View all projects',
    primaryTo: '/#work',
    secondaryLabel: 'Get in touch',
    secondaryHref: `mailto:${siteMetadata.contactEmail}`,
  },
}
