import type { NavItem, SiteMetadata, SocialLink } from '@/types/content'

export const siteMetadata: SiteMetadata = {
  name: 'Nischal Skanda',
  title: 'Nischal Skanda',
  description: 'Design engineer and developer portfolio.',
  url: 'https://nischalskanda.com',
  contactEmail: 'hello@nischalskanda.com',
}

export const navItems = [
  { label: 'life', to: '/life', kind: 'route' },
  { label: 'labs', to: '/#labs', kind: 'section' },
  {
    label: 'blog',
    to: 'https://blog.nischalskanda.tech',
    kind: 'external',
  },
] satisfies Array<NavItem & { kind: 'section' | 'route' | 'external' }>

export const footerNavItems: NavItem[] = [
  { label: 'Work', to: '/#work' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
]

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/' },
  { label: 'Twitter', url: 'https://twitter.com/' },
]

export const connectEmail = 'nischal.skanda07@gmail.com'

export interface ConnectLink {
  key: string
  label: string
  href?: string
  kind: 'copy-email' | 'external'
  active?: boolean
}

export const connectLinks: ConnectLink[] = [
  { key: 'email', label: 'Email', kind: 'copy-email' },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    href: 'https://x.com/nischalskanda',
    kind: 'external',
    active: true,
  },
  {
    key: 'github',
    label: 'GitHub',
    href: 'https://github.com/RexO77',
    kind: 'external',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nischalskanda',
    kind: 'external',
  },
  {
    key: 'resume',
    label: 'Resume',
    href: 'https://www.dropbox.com/scl/fi/d4c7l11u4d0xdwndentqn/Nischal_Resume.pdf?rlkey=0bx78a5ov03848z5ie9g3n2t0&st=22im99an&dl=0',
    kind: 'external',
  },
]
