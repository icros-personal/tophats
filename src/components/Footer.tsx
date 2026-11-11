import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gallery } from '../gallery';

const FACTS = [
  'The tallest recorded top hat was roughly the height of a small giraffe’s opinion of itself.',
  'A collapsible top hat is called a "gibus" — the original pop-up.',
  'Top hats were once accused of causing a riot. They have since apologised.',
  'Every top hat is legally a tiny chimney for thoughts.',
];

/** Fixed at build time so pre-rendered HTML and the first client render match. */
const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  // Start with a fixed fact (matching the pre-rendered HTML), then pick
  // today's after hydration.
  const [fact, setFact] = useState(FACTS[0]);
  useEffect(() => setFact(FACTS[new Date().getDate() % FACTS.length]), []);
  const recent = gallery.slice(0, 4);

  return (
    <footer className="site-footer">
      <div className="container footer-widgets">
        <section>
          <h2 className="widget-title">About the Hattery</h2>
          <p>
            Top Hats 4 All is a small, slightly overdressed collective dedicated to the radical idea that
            everyone — and everything — deserves a proper hat.
          </p>
        </section>
        <section>
          <h2 className="widget-title">From the Gallery</h2>
          <ul className="widget-list">
            {recent.map((h) => (
              <li key={h.slug}>
                <Link to={`/gallery/${h.slug}/`}>{h.title}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="widget-title">Hat Fact of the Day</h2>
          <p className="hat-fact">{fact}</p>
        </section>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {BUILD_YEAR} Top Hats 4 All. All hats reserved.</span>
          <span>
            <Link to="/gallery/">Gallery</Link> · <Link to="/contact/">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
