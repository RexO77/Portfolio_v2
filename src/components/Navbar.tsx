import { Link } from 'react-router-dom'
import { useIntroState } from '@/features/intro/useIntroState'

const navLinks = [
  { label: 'work', to: '/#work' },
  { label: 'life', to: '/life' },
  { label: 'labs', to: '/#labs' },
  { label: 'blog', to: '/#blog' },
]

export function Navbar() {
  const { introHandoffStarted, introComplete } = useIntroState()
  const isIntroPending = !introHandoffStarted && !introComplete

  return (
    <header
      className={`navbar${isIntroPending ? ' navbar--intro-pending' : ''}`}
      aria-hidden={isIntroPending}
    >
      <Link to="/" className="navbar__logo">
        Nischal Skanda
      </Link>
      <nav className="navbar__nav">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="navbar__link"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
