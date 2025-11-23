// app/secretariat/page.tsx

export const revalidate = 60;

import SecretariatCard from "@/components/SecretariatCard";
import { SECRETARIAT_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { SecretariatType } from "@/types";
import type { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  const allSecretariat: SecretariatType[] = await client.fetch(SECRETARIAT_QUERY);
  const secretariatNames = allSecretariat.map(member => member.name).join(', ');
  const description = `Meet the dedicated Secretariat of BORNOVAMUN'26, including ${secretariatNames}. Discover the team behind the conference.`;

  return {
    title: `Secretariat`,
    description: description,
    keywords: [
      "BORNOVAMUN'26",
      "Secretariat",
      secretariatNames,
      "MUN conference team",
      "Model United Nations staff",
      "Bornova MUN organizers"
    ],
    openGraph: {
      title: `Secretariat`,
      description: description,
      url: "https://www.bornovamun.org/secretariat",
    },
    twitter: {
      title: `Secretariat`,
      description: description,
      card: "summary_large_image",
    },
  };
};

const Secretariat = async () => {
  const allSecretariat = await client.fetch(SECRETARIAT_QUERY);

  // Sort Secretariat by their ID in ascending order
  const sortedSecretariat = [...allSecretariat].sort((a, b) => (a.id || Infinity) - (b.id || Infinity));

  return (
    <>
      <div className="mx-auto pb-20 max-sm:pb-12">
        <h1 className="text-6xl max-sm:text-3xl mt-16 max-sm:mt-8 text-center text-white font-bold">Secretariat</h1>

        {/* Combined responsive grid */}
        <div className="grid place-items-center w-full grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-16 px-4 sm:px-0 mt-12 sm:mt-16">
          {sortedSecretariat.map((secretariat: SecretariatType, index) => (
            <a
              className="w-fit hover:scale-105 transition-transform duration-500"
              href={`${secretariat.link || "/"}`}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <SecretariatCard
                imageUrl={secretariat.imageUrl}
                secretariatName={secretariat.name}
              />
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Secretariat;