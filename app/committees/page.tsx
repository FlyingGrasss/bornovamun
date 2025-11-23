// app/committees/page.tsx

export const revalidate = 12000;

import CommitteeCard from "@/components/CommitteeCard";
import { COMMITTEES_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { CommitteeType } from "@/types";
import type { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  const allCommittees: CommitteeType[] = await client.fetch(COMMITTEES_QUERY);
  const committeeNames = allCommittees.map(committee => committee.name).join(', ');
  const description = `Explore the various committees at BORNOVAMUN'26: ${committeeNames}.`;

  return {
    title: `Committees`,
    description: description,
    keywords: ["BORNOVAMUN'26", "Committees", committeeNames, "MUN"],
    openGraph: {
      title: `Committees`,
      description: description,
      url: "https://www.bornovamun.org/committees",
    },
    twitter: {
      title: `Committees`,
      description: description,
      card: "summary_large_image",
    },
  };
};

const Committees = async () => {
  const allCommittees = await client.fetch(COMMITTEES_QUERY);
  const sortedCommittees = [...allCommittees].sort((a, b) => (a.id || Infinity) - (b.id || Infinity));

  return (
    <div className="min-h-screen pb-20 overflow-hidden">
      <div className="mx-auto container px-4">
        <h1 className="text-6xl max-sm:text-4xl mt-20 mb-20 text-center text-white font-bold tracking-tight">
          Committees
        </h1>

        <div className="flex flex-col items-center gap-24 md:gap-32">
          {sortedCommittees.map((committee: CommitteeType, index) => (
             <CommitteeCard
                key={index}
                imageUrl={committee.imageUrl}
                committeeName={committee.name}
                slug={committee.slug}
                // Pass full object if you want to extract description inside the card, 
                // but currently your query fetches everything so this works.
                // Assuming description is fetched in COMMITTEES_QUERY (added in previous step)
                description={committee.description}
                align={index % 2 !== 0 ? 'right' : 'left'}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Committees;