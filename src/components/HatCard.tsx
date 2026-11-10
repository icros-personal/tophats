import { Link } from 'react-router-dom';
import { asset, type GalleryItem } from '../gallery';

export default function HatCard({ hat }: { hat: GalleryItem }) {
  return (
    <Link to={`/gallery/${hat.slug}`} className="hat-card">
      <div className="hat-card-media">
        <img src={asset(hat.thumb)} alt={hat.title} width={600} height={450} loading="lazy" />
      </div>
      <div className="hat-card-body">
        <h3 className="hat-card-title">{hat.title}</h3>
        {hat.summary && <p className="hat-card-summary">{hat.summary}</p>}
      </div>
    </Link>
  );
}
