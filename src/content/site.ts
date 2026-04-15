import type { NavItem, SiteMetadata, SocialLink } from '@/types/content'

export const siteMetadata: SiteMetadata = {
  name: 'Nischal Skanda',
  title: 'Nischal Skanda',
  description: 'Design engineer and developer portfolio.',
  url: 'https://nischalskanda.com',
  contactEmail: 'hello@nischalskanda.com',
}

export const navItems = [
  { label: 'work', to: '/#work', kind: 'section' },
  { label: 'life', to: '/life', kind: 'route' },
  { label: 'labs', to: '/#labs', kind: 'section' },
  { label: 'blog', to: '/#blog', kind: 'section' },
] satisfies Array<NavItem & { kind: 'section' | 'route' }>

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
