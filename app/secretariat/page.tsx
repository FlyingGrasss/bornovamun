// app/secretariat/page.tsx

export const revalidate = 60;

import SecretariatCard from "@/components/SecretariatCard";
import { SECRETARIAT_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { SecretariatType } from "@/types";
import type { Metadata } from 'next';

export const generateMetadata = async (): Promise<Metadata> => {
  const allSecretariat: SecretariatType[] = await client.fetch(SECRETARIAT_QUERY);
  const names = allSecretariat.map(member => member.name).join(', ');
  const description = `Meet the dedicated Secretariat of BORNOVAMUN'26.`;

  return {
    title: `Secretariat`,
    description: description,
    keywords: ["BORNOVAMUN'26", "Secretariat", names],
    openGraph: {
      title: `Secretariat`,
      description: description,
      url: "https://www.bornovamun.org/secretariat",
    },
  };
};

const Secretariat = async () => {
  const allSecretariat = await client.fetch(SECRETARIAT_QUERY);
  const sortedSecretariat = [...allSecretariat].sort((a, b) => (a.id || Infinity) - (b.id || Infinity));

  return (
    <div className="min-h-screen pb-20 overflow-hidden">
      <div className="mx-auto container px-4">
        <h1 className="text-6xl max-sm:text-4xl mt-20 mb-20 text-center text-white font-bold tracking-tight">
          Secretariat
        </h1>

        <div className="flex flex-col items-center gap-24 md:gap-32">
          {sortedSecretariat.map((secretariat: SecretariatType, index) => (
              <SecretariatCard
                key={index}
                imageUrl={secretariat.imageUrl}
                secretariatName={secretariat.name}
                role={secretariat.role}
                slug={secretariat.slug}
                align={index % 2 !== 0 ? 'right' : 'left'}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Secretariat;