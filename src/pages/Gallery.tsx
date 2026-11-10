import HatCard from '../components/HatCard';
import PageHeader from '../components/PageHeader';
import { gallery } from '../gallery';
import { usePageTitle } from '../usePageTitle';

export default function Gallery() {
  usePageTitle('Gallery');

  return (
    <>
      <PageHeader title="The Gallery" crumbs={[{ label: 'Gallery' }]}>
        {gallery.length} distinguished specimens and counting. Click any hat to learn more.
      </PageHeader>
      <section className="container page-body">
        {gallery.length === 0 ? (
          <p className="center">The hat stand is empty. Add some images to the gallery folder!</p>
        ) : (
          <div className="hat-grid">
            {gallery.map((hat) => (
              <HatCard key={hat.slug} hat={hat} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
