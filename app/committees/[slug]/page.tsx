// app/committees/[slug]/page.tsx

import { client } from "@/sanity/lib/client";
import { COMMITTEE_BY_SLUG_QUERY, COMMITTEES_QUERY } from "@/sanity/lib/queries";
import { CommitteeType } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

// Generate static params does not receive props, so no await needed here for params
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

const CommitteePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  
  // Now slug is defined, so the GROQ query will work
  const committee: CommitteeType = await client.fetch(COMMITTEE_BY_SLUG_QUERY, { slug });

  if (!committee) {
    notFound();
  }

  const renderText = (blocks: any[]) => {
      if(!blocks) return null;
      return blocks.map((block: any, i: number) => (
          <p key={i} className="mb-4 text-gray-300 leading-relaxed text-lg">
             {block.children?.map((child: any) => child.text).join('')}
          </p>
      ))
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
         {/* Left: Image */}
         <div className="w-full md:w-1/3">
             <Image
                src={committee.imageUrl}
                alt={committee.name}
                width={600}
                height={800}
                className="w-full h-auto rounded-3xl border-2 border-[hsl(42,72%,52%)] shadow-2xl"
             />
         </div>

         {/* Right: Content */}
         <div className="w-full md:w-2/3">
            <h1 className="text-5xl font-bold text-[hsl(42,72%,52%)] mb-8">{committee.name}</h1>
            
            <div className="bg-black/30 p-8 rounded-3xl backdrop-blur-sm border border-white/10 mb-8">
                {renderText(committee.description)}
            </div>

            {committee.documents && committee.documents.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Study Guides & Documents</h3>
                    <div className="grid gap-4">
                        {committee.documents.map((doc, i) => (
                            <a 
                                key={i} 
                                href={`${doc.url}?dl=`} 
                                className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors group cursor-pointer"
                            >
                                <span className="text-white font-medium">{doc.title || `Document ${i+1}`}</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[hsl(42,72%,52%)]">
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