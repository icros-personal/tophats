import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { asset, findHat } from '../gallery';
import { usePageTitle } from '../usePageTitle';
import NotFound from './NotFound';

export default function HatDetail() {
  const { slug } = useParams();
  const found = findHat(slug);
  usePageTitle(found?.hat.title ?? 'Hat not found');

  if (!found) return <NotFound />;
  const { hat, prev, next } = found;

  return (
    <>
      <PageHeader title={hat.title} crumbs={[{ label: 'Gallery', to: '/gallery' }, { label: hat.title }]}>
        {hat.summary}
      </PageHeader>

      <article className="container page-body hat-detail">
        <figure className="hat-figure">
          <a href={asset(hat.full)} target="_blank" rel="noreferrer" title="Open full size">
            <img src={asset(hat.full)} alt={hat.title} width={hat.width} height={hat.height} />
          </a>
        </figure>

        <div className="hat-description" dangerouslySetInnerHTML={{ __html: hat.descriptionHtml }} />

        <nav className="post-nav" aria-label="More hats">
          {prev ? (
            <Link to={`/gallery/${prev.slug}`} className="post-nav-link prev">
              <span className="post-nav-label">← Previous hat</span>
              <span className="post-nav-title">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/gallery/${next.slug}`} className="post-nav-link next">
              <span className="post-nav-label">Next hat →</span>
              <span className="post-nav-title">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="center">
          <Link to="/gallery" className="text-link">
            Back to the gallery
          </Link>
        </p>
      </article>
    </>
  );
}
