// app/apply/[applicationType]/page.tsx

import { notFound } from 'next/navigation';
import ApplicationForm from '@/components/ApplicationForm';

// Static generation definition (Server-side)
export async function generateStaticParams() {
  return [
    { applicationType: 'delegate' },
    { applicationType: 'press' },
    { applicationType: 'pr' },
    { applicationType: 'admin' },
    { applicationType: 'delegation' },
  ];
}

interface PageProps {
  params: Promise<{
    applicationType: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await the params before accessing properties
  const { applicationType } = await params;

  // Double check valid types
  const validTypes = ['delegate', 'press', 'pr', 'admin', 'delegation'];
  if (!validTypes.includes(applicationType)) {
    notFound();
  }

  // Render the Client Component
  return <ApplicationForm applicationType={applicationType} />;
}