import { Link } from 'react-router-dom';

export function HatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="50" rx="28" ry="7" fill="var(--ink)" />
      <path d="M16 50 L19 12 A13 4 0 0 1 45 12 L48 50 A16 5 0 0 1 16 50 Z" fill="var(--ink)" />
      <path d="M17.6 40 L47 40 L47.7 48 A16 5 0 0 1 16.4 48 Z" fill="var(--mustard)" />
      <ellipse cx="32" cy="12" rx="13" ry="4" fill="#4a3d5c" />
      <rect x="22" y="16" width="3" height="20" rx="1.5" fill="#fff" opacity="0.18" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Top Hats 4 All — home">
      <HatIcon className="logo-hat" />
      <span className="logo-text">
        <span className="logo-title">
          Top Hats <span className="logo-4">4</span> All
        </span>
        <span className="logo-tagline">Distinguished headwear for everyone</span>
      </span>
    </Link>
  );
}
