import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'work', to: '/#work' },
  { label: 'life', to: '/life' },
  { label: 'labs', to: '/#labs' },
  { label: 'blog', to: '/#blog' },
]

export function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar__logo navbar__logo--anim">
        Nischal Skanda
      </Link>
      <nav className="navbar__nav">
        {navLinks.map((link, i) => (
          <Link
            key={link.label}
            to={link.to}
            className="navbar__link"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
