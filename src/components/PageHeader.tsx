import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  to?: string;
}

/** WordPress-style page title band with breadcrumbs. */
export default function PageHeader({
  title,
  crumbs,
  children,
}: {
  title: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label}>{c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
        <h1 className="page-title">{title}</h1>
        {children && <p className="page-subtitle">{children}</p>}
      </div>
    </header>
  );
}
