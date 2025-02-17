'use client';

import dynamic from 'next/dynamic';

const TestFormClient = dynamic(
  () => import('@/components/custom/FormAddEditTest'),
  { ssr: false }
);

export default TestFormClient;
