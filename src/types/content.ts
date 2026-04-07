export interface SiteMetadata {
  name: string
  title: string
  description: string
  url: string
  ogImage?: string
}

export interface SocialLink {
  label: string
  url: string
  icon?: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  tags: string[]
  thumbnail: string
  video?: string
  url?: string
  repo?: string
  featured: boolean
  year: number
}

export interface Experience {
  id: string
  role: string
  company: string
  companyUrl?: string
  startDate: string
  endDate?: string
  description: string
  highlights: string[]
}

export interface NavItem {
  label: string
  href: string
}
