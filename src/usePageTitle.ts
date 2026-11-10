import { useEffect } from 'react';

const SITE = 'Top Hats 4 All';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} – ${SITE}` : `${SITE} – Distinguished headwear for everyone`;
  }, [title]);
}
