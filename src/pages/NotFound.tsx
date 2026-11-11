import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function NotFound() {
  return (
    <>
      <PageHeader title="Hat not found" crumbs={[{ label: '404' }]} />
      <section className="container narrow page-body center">
        <p className="lede">We looked in every hat. This page isn’t in any of them.</p>
        <p>
          <Link to="/" className="button">
            Back to the front page
          </Link>
        </p>
      </section>
    </>
  );
}
