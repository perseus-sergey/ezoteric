'use client';

import ErrorPage from '@/components/custom/ErrorPage';

const errorFn = ({ reset }: { reset: () => void }) => (
  <ErrorPage resetFn={reset} />
);

export default errorFn;
