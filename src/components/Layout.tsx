import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getPageMeta } from '../meta';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  const { title } = getPageMeta(pathname);

  // Start each new page at the top, like a normal multi-page site.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Pre-rendered HTML already has the right <title>; this keeps it right
  // during client-side navigation (and in the dev server).
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
