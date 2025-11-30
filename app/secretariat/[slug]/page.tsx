// app/secretariat/[slug]/page.tsx

import { client } from "@/sanity/lib/client";
import { SECRETARIAT_BY_SLUG_QUERY, SECRETARIAT_QUERY } from "@/sanity/lib/queries";
import { SecretariatType } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';

export async function generateStaticParams() {
  const members: SecretariatType[] = await client.fetch(SECRETARIAT_QUERY);
  return members.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member: SecretariatType = await client.fetch(SECRETARIAT_BY_SLUG_QUERY, { slug });
  
  if (!member) return {};
  
  return {
    title: `${member.name} - Secretariat`,
    description: `Meet ${member.name}, ${member.role} at BORNOVAMUN'26.`,
    openGraph: {
      title: member.name,
      images: [member.imageUrl],
    },
  };
}

// Duplicated components to ensure self-containment as requested (could be a shared file, but keeping in page as per instruction)
const portableTextComponents = {
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-5xl max-sm:text-3xl font-bold mt-12 mb-6 text-[hsl(42,72%,52%)] leading-tight">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-4xl max-sm:text-2xl font-bold mt-12 mb-6 text-white leading-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-3xl max-sm:text-xl font-bold mt-10 mb-5 text-white leading-tight">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-2xl max-sm:text-lg font-bold mt-8 mb-4 text-white leading-tight">{children}</h4>
    ),
    h5: ({ children }: any) => (
      <h5 className="text-xl max-sm:text-base font-bold mt-6 mb-3 text-white leading-tight">{children}</h5>
    ),
    h6: ({ children }: any) => (
      <h6 className="text-lg max-sm:text-sm font-bold mt-4 mb-2 text-white leading-tight">{children}</h6>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 text-lg  max-sm:text-sm leading-8 text-gray-300">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[hsl(42,72%,52%)] pl-8 py-4 my-8 italic text-xl max-sm:text-base text-gray-400 bg-black/20">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (<strong className="font-bold text-white">{children}</strong>),
    em: ({ children }: any) => (<em className="italic">{children}</em>),
    link: ({ children, value }: any) => (
      <a href={value.href} className="text-[hsl(42,72%,52%)] font-semibold underline hover:text-white transition" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    code: ({ children }: any) => (<code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-300">{children}</code>),
  },
  list: {
    bullet: ({ children }: any) => (<ul className="list-disc list-inside mb-8 space-y-3 text-lg text-gray-300 ml-4">{children}</ul>),
    number: ({ children }: any) => (<ol className="list-decimal list-inside mb-8 space-y-3 text-lg text-gray-300 ml-4">{children}</ol>),
  },
  listItem: {
    bullet: ({ children }: any) => (<li className="mb-2">{children}</li>),
    number: ({ children }: any) => (<li className="mb-2">{children}</li>),
  },
}

const SecretariatPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const member: SecretariatType = await client.fetch(SECRETARIAT_BY_SLUG_QUERY, { slug });

  if (!member) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
         <div className="w-full md:w-1/3 sticky top-24">
             <Image
                src={member.imageUrl}
                alt={member.name}
                width={600}
                height={800}
                className="w-full h-auto rounded-3xl border-2 border-[hsl(42,72%,52%)] shadow-2xl mb-6"
             />
             {member.instagram && (
                 <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity shadow-lg">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                     </svg>
                     Follow
                 </a>
             )}
         </div>

         <div className="w-full md:w-2/3">
            <h1 className="text-6xl max-sm:text-3xl font-bold text-white mb-2">{member.name}</h1>
            <h2 className="text-3xl max-sm:text-xl text-[hsl(42,72%,52%)] mb-8 font-semibold">{member.role}</h2>
            
            <div className="prose max-w-none">
                <PortableText 
                    value={member.bio} 
                    components={portableTextComponents}
                />
            </div>
         </div>
      </div>
    </div>
  );
};

export default SecretariatPage;