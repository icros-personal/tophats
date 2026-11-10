import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/gallery', label: 'Gallery', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

/** Scroll distance (px) after which the header collapses into its slim form. */
const COMPACT_AT = 40;

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > COMPACT_AT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className={`site-header${compact ? ' is-compact' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <div className="container header-inner">
          <Logo />
          <button
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="menu-toggle-bars" aria-hidden="true" />
            <span className="sr-only">Menu</span>
          </button>
          <nav id="primary-nav" className="primary-nav" aria-label="Primary">
            <ul>
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      {/* Header is position:fixed; this reserves its full height so content never jumps. */}
      <div className="header-spacer" aria-hidden="true" />
    </>
  );
}
