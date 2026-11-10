import { useState, type FormEvent } from 'react';
import PageHeader from '../components/PageHeader';
import { HatIcon } from '../components/Logo';
import { usePageTitle } from '../usePageTitle';

/** Visual-only contact form: nothing is sent anywhere. */
export default function Contact() {
  usePageTitle('Contact');
  const [sentTo, setSentTo] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get('name');
    setSentTo(String(name || 'friend'));
  }

  return (
    <>
      <PageHeader title="Contact" crumbs={[{ label: 'Contact' }]}>
        Questions, fittings, or hat-related confessions — we’re all ears (under the hat).
      </PageHeader>

      <section className="container page-body contact-layout">
        <div className="contact-main">
          {sentTo ? (
            <div className="thanks" role="status">
              <HatIcon className="thanks-hat" />
              <h2>Thank you, {sentTo}!</h2>
              <p>
                Your message has been placed carefully inside a top hat. Someone will pull it out shortly.
                <br />
                <small>(This is a prototype — nothing was actually sent.)</small>
              </p>
              <button type="button" className="button button-ghost" onClick={() => setSentTo(null)}>
                Send another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="field-row">
                <label className="field">
                  <span>Your name *</span>
                  <input name="name" required autoComplete="name" />
                </label>
                <label className="field">
                  <span>Email *</span>
                  <input name="email" type="email" required autoComplete="email" />
                </label>
              </div>
              <label className="field">
                <span>Subject</span>
                <select name="subject" defaultValue="fitting">
                  <option value="fitting">Booking a fitting</option>
                  <option value="critter">My pet needs a hat</option>
                  <option value="rabbit">I found a rabbit in my hat</option>
                  <option value="other">Something else entirely</option>
                </select>
              </label>
              <label className="field">
                <span>Message *</span>
                <textarea name="message" rows={6} required />
              </label>
              <label className="field-check">
                <input type="checkbox" name="newsletter" />
                <span>Send me the monthly Brim Bulletin</span>
              </label>
              <button type="submit" className="button">
                Send message
              </button>
            </form>
          )}
        </div>

        <aside className="contact-aside">
          <div className="widget-box">
            <h2 className="widget-title">Visit the Hattery</h2>
            <address>
              4 Brimstone Lane
              <br />
              Crownsbury, Hatfordshire
              <br />
              TH4 4LL
            </address>
          </div>
          <div className="widget-box">
            <h2 className="widget-title">Opening Hours</h2>
            <dl className="hours">
              <dt>Mon – Fri</dt>
              <dd>10am – 6pm</dd>
              <dt>Saturday</dt>
              <dd>10am – Teatime</dd>
              <dt>Sunday</dt>
              <dd>Hats only</dd>
            </dl>
          </div>
        </aside>
      </section>
    </>
  );
}
