import type { SiteMetadata, SocialLink, NavItem } from '@/types/content'

export const siteMetadata: SiteMetadata = {
  name: 'Nischal Skanda',
  title: 'Nischal Skanda',
  description: 'Design engineer and developer portfolio.',
  url: 'https://nischalskanda.com',
}

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/' },
  { label: 'Twitter', url: 'https://twitter.com/' },
]

export const navItems: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]
