"use client";

import ErrorPage from "@/components/custom/ErrorPage";

const errorFn = ({ reset }: { reset: () => void }) => (
  <html lang="en">
    <body suppressHydrationWarning={true}>
      <main className="article">
        <ErrorPage resetFn={reset} />
      </main>
    </body>
  </html>
);

export default errorFn;
