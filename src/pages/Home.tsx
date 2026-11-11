import { Link } from 'react-router-dom';
import HeroArt from '../components/HeroArt';
import HatCard from '../components/HatCard';
import { gallery } from '../gallery';

export default function Home() {
  const featured = gallery.slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <HeroArt />
        </div>
      </section>

      <section className="intro container narrow">
        <p className="eyebrow">Est. just now · Purveyors of loftiness</p>
        <h1 className="intro-title">Everyone deserves a little more height.</h1>
        <p className="lede">
          Welcome to <strong>Top Hats 4 All</strong>, the internet’s most inclusive collection of tall,
          cylindrical, faintly ridiculous headwear. Whether you are a duke, a dancer, or a damp little blob who
          lives under the stairs, there is a top hat here with your name on it (please don’t write on the hats).
        </p>
        <p>
          Browse our growing gallery, learn the stories behind each topper, and drop us a line if you’d like a
          fitting. We promise not to pull anything out of you.
        </p>
        <p className="intro-actions">
          <Link to="/gallery/" className="button">
            Browse the gallery
          </Link>
          <Link to="/contact/" className="button button-ghost">
            Get in touch
          </Link>
        </p>
      </section>

      {featured.length > 0 && (
        <section className="featured">
          <div className="container">
            <h2 className="section-title">
              <span>Featured Hats</span>
            </h2>
            <div className="hat-grid">
              {featured.map((hat) => (
                <HatCard key={hat.slug} hat={hat} />
              ))}
            </div>
            <p className="center">
              <Link to="/gallery/" className="text-link">
                See all {gallery.length} hats →
              </Link>
            </p>
          </div>
        </section>
      )}

      <section className="container narrow columns">
        <div>
          <h2>Why a top hat?</h2>
          <p>
            Because a regular hat only covers your head. A top hat <em>announces</em> it. It adds roughly seven
            inches of gravitas and is the only garment that doubles as a storage unit for rabbits.
          </p>
        </div>
        <div>
          <h2>Why for all?</h2>
          <p>
            For too long, the top hat has been the preserve of magicians, ringmasters, and gentlemen on biscuit
            tins. We believe in a world where the hat fits whoever wants to wear it — whatever their size, shape,
            or number of legs.
          </p>
        </div>
      </section>
    </>
  );
}
