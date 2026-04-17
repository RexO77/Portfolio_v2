export interface SiteMetadata {
  name: string
  title: string
  description: string
  url: string
  contactEmail: string
  ogImage?: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface NavItem {
  label: string
  to: string
  kind?: 'section' | 'route'
}

export interface ActionLink {
  label: string
  href: string
}

export interface HomeSectionContent {
  label: string
  title: string
  description: string
}

export interface HomePageContent {
  hero: {
    eyebrow: string
    lines: string[]
    badge: string
  }
  work: HomeSectionContent
  about: HomeSectionContent & {
    paragraphs: string[]
    highlights: string[]
    visual: {
      src: string
      alt: string
    }
  }
  labs: HomeSectionContent
  contact: HomeSectionContent & {
    links: ActionLink[]
  }
}

export interface ProjectSummary {
  id: string
  label: string
  title: string
  description: string
  hoverSummary: string
  role: string
  timeline: string
  tags: string[]
  imageSrc: string
  videoSrc?: string
  year?: string
  to: string
  ctaLabel?: string
  mobileCtaLabel?: string
}

export interface CaseStudyMetaItem {
  label: string
  value: string
}

export interface CaseStudyMetric {
  from: number
  target: number
  prefix?: string
  suffix?: string
  description: string
}

export interface CaseStudyImage {
  src: string
  alt: string
  caption: string
}

export interface CaseStudySection {
  label: string
  heading?: string
  display?: string
  paragraphs: string[]
  bullets?: string[]
  image?: CaseStudyImage
}

export interface CaseStudyPanelRow {
  q: string
  tag: string
  dim?: boolean
}

export interface CaseStudyTreeBranch {
  name: string
  leaves?: string[]
  collapsed?: boolean
}

export interface CaseStudyContent {
  summary: ProjectSummary
  hero: {
    backLabel: string
    title: string
    subtitle: string
    meta: CaseStudyMetaItem[]
    shipped: string
    image: CaseStudyImage
  }
  context: CaseStudySection
  problem: CaseStudySection
  whyItMattered: {
    label: string
    intro: string
    stats: CaseStudyMetric[]
    note: string
  }
  obviousFix: CaseStudySection
  reframe: CaseStudySection & {
    rows: CaseStudyPanelRow[]
    panelsCaption: string
    tree: {
      root: string
      branches: CaseStudyTreeBranch[]
    }
  }
  system: CaseStudySection
  ownership: {
    label: string
    paragraphs: string[]
    successLabel: string
    successBullets: string[]
  }
  impact: {
    label: string
    display: string
    paragraphs: string[]
  }
  gate: {
    description: string
    label: string
    placeholder: string
    buttonLabel: string
    errorMessage: string
    password: string
  }
  unlockedSections: Array<{
    label: string
    paragraphs: string[]
  }>
  cta: {
    heading: string
    primaryLabel: string
    primaryTo: string
    secondaryLabel: string
    secondaryHref: string
  }
}

export interface LifePhoto {
  src: string
  alt: string
  left: string
  top: string
  z?: number
}

export interface LifeEssayPortrait {
  src: string
  alt: string
  caption: string
}

export interface LifeEssayContent {
  eyebrow: string
  titleLines: string[]
  portrait: LifeEssayPortrait
  paragraphs: string[]
  signoff: string
}

export interface LifePageContent {
  titleLead: string
  titleEmphasis: string
  photos: LifePhoto[]
  essay: LifeEssayContent
}
