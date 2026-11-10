import { Link } from 'react-router-dom';
import { gallery } from '../gallery';

const FACTS = [
  'The tallest recorded top hat was roughly the height of a small giraffe’s opinion of itself.',
  'A collapsible top hat is called a "gibus" — the original pop-up.',
  'Top hats were once accused of causing a riot. They have since apologised.',
  'Every top hat is legally a tiny chimney for thoughts.',
];

export default function Footer() {
  const fact = FACTS[new Date().getDate() % FACTS.length];
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
                <Link to={`/gallery/${h.slug}`}>{h.title}</Link>
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
          <span>© {new Date().getFullYear()} Top Hats 4 All. All hats reserved.</span>
          <span>
            <Link to="/gallery">Gallery</Link> · <Link to="/contact">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
