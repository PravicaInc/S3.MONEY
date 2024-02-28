// Added this so that `/` and `/home` work correctly with the same content.
// Cannot use NextJS rewrites with output='export'

import HomePage from './home/page';

export { metadata } from './home/layout';

export default function Home() {
  return (
    <HomePage />
  );
}
