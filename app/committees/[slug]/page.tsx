// app/committees/[slug]/page.tsx

import { client } from "@/sanity/lib/client";
import { COMMITTEE_BY_SLUG_QUERY, COMMITTEES_QUERY } from "@/sanity/lib/queries";
import { CommitteeType } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';

export async function generateStaticParams() {
  const committees: CommitteeType[] = await client.fetch(COMMITTEES_QUERY);
  return committees.map((committee) => ({
    slug: committee.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const committee: CommitteeType = await client.fetch(COMMITTEE_BY_SLUG_QUERY, { slug });
  
  if (!committee) return {};
  
  return {
    title: committee.name,
    description: `Details and study guides for the ${committee.name} committee.`,
    openGraph: {
      title: committee.name,
      images: [committee.imageUrl],
    },
  };
}

// Updated PortableText components with theme colors
const portableTextComponents = {
  block: {
    // Heading 1: Gold
    h1: ({ children }: any) => (
      <h1 className="text-5xl font-bold mt-12 mb-6 text-[hsl(42,72%,52%)] leading-tight">
        {children}
      </h1>
    ),
    // Heading 2: White
    h2: ({ children }: any) => (
      <h2 className="text-4xl font-bold mt-12 mb-6 text-white leading-tight">
        {children}
      </h2>
    ),
    // Heading 3: White
    h3: ({ children }: any) => (
      <h3 className="text-3xl font-bold mt-10 mb-5 text-white leading-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-2xl font-bold mt-8 mb-4 text-white leading-tight">
        {children}
      </h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-xl font-bold mt-6 mb-3 text-white leading-tight">
        {children}
      </h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-lg font-bold mt-4 mb-2 text-white leading-tight">
        {children}
      </h6>
    ),
    // Normal text: Light Gray for readability on dark background
    normal: ({ children }: any) => (
      <p className="mb-6 text-lg max-sm:text-sm leading-8 text-gray-300">
        {children}
      </p>
    ),
    // Blockquote
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[hsl(42,72%,52%)] pl-8 py-4 my-8 italic text-xl text-gray-400 bg-black/20">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-[hsl(42,72%,52%)] font-semibold underline hover:text-white transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-300">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-8 space-y-3 text-lg text-gray-300 ml-4">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-8 space-y-3 text-lg text-gray-300 ml-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="mb-2">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="mb-2">{children}</li>
    ),
  },
}

const CommitteePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const committee: CommitteeType = await client.fetch(COMMITTEE_BY_SLUG_QUERY, { slug });

  if (!committee) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
         <div className="w-full md:w-1/3">
             <Image
                src={committee.imageUrl}
                alt={committee.name}
                width={600}
                height={800}
                className="w-full h-auto rounded-3xl border-2 border-[hsl(42,72%,52%)] shadow-2xl"
             />
         </div>

         <div className="w-full md:w-2/3">
            <h1 className="text-5xl font-bold text-[hsl(42,72%,52%)] mb-8">{committee.name}</h1>
            
            <div className="bg-black/30 p-8 rounded-3xl backdrop-blur-sm border border-white/10 mb-8">
                <PortableText
                    value={committee.description}
                    components={portableTextComponents}
                />
            </div>

            {committee.documents && committee.documents.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Study Guides & Documents</h3>
                    <div className="grid gap-4">
                        {committee.documents.map((doc, i) => (
                            <a 
                                key={i} 
                                href={`${doc.url}?dl=`} 
                                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group cursor-pointer border border-transparent hover:border-[hsl(42,72%,52%)]"
                            >
                                <span className="text-white font-medium">{doc.title || `Document ${i+1}`}</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[hsl(42,72%,52%)] group-hover:text-white transition-colors">
                                    <path d="M12 15V3M12 15L7 10M12 15L17 10M2 21H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default CommitteePage;