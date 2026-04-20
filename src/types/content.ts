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
  kind?: 'section' | 'route' | 'external'
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

export interface LifeBook {
  title: string
  author: string
  src: string
  largeSrc?: string
}

export interface LifeBooksSection {
  eyebrow: string
  caption: string
  items: LifeBook[]
}

export interface LifeSpotifyPlaylist {
  title: string
  embedUrl: string
}

export interface LifeSpotifySection {
  eyebrow: string
  caption?: string
  items: LifeSpotifyPlaylist[]
}

export interface LifeEssayContent {
  eyebrow: string
  titleLines: string[]
  portrait: LifeEssayPortrait
  paragraphs: string[]
  signoff: string
  books?: LifeBooksSection
  spotify?: LifeSpotifySection
}

export interface LifePageContent {
  titleLead: string
  titleEmphasis: string
  photos: LifePhoto[]
  essay: LifeEssayContent
}

export type ExperienceAccent =
  | 'green'
  | 'yellow'
  | 'blue'
  | 'orange'
  | 'purple'
  | 'sand'

export interface WorkExperienceMetaItem {
  label: string
  value: string
}

export interface WorkExperience {
  id: string
  index: string
  role: string
  company: string
  period: string
  /** Calendar year the role started. */
  startYear: number
  /** Calendar month the role started (1–12). */
  startMonth: number
  /** Calendar year the role ended, or `'present'` for a current role. */
  endYear: number | 'present'
  /** Calendar month the role ended (1–12). Omit when endYear is `'present'`. */
  endMonth?: number
  description: string
  meta: WorkExperienceMetaItem[]
  accent: ExperienceAccent
}
