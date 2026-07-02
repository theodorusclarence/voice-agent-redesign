import type { NextPageContext } from 'next';

export default function Error({ statusCode }: { statusCode?: number }) {
  return (
    <main>
      <section>
        <div>
          <h1>
            Oops, something went wrong!
            {statusCode ? ` (${statusCode})` : ''}
          </h1>
          <button onClick={() => window.location.reload()}>Try again</button>
        </div>
      </section>
    </main>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
