'use client';

import * as React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main>
      <section>
        <div>
          <h1>Oops, something went wrong!</h1>
          <button onClick={reset}>Try again</button>
        </div>
      </section>
    </main>
  );
}
