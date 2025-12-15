// app/letters/page.tsx

import Image from 'next/image';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Letters",
  description: "Read the official letters related to BORNOVAMUN'26.",
  keywords: [
    "BORNOVAMUN'26",
    "Letters",
    "Secretary General",
    "MUN conference",
    "Model United Nations",
    "Bornova MUN"
  ],
  openGraph: {
    title: "Letters",
    description: "Read the official letters related to BORNOVAMUN'26.",
    url: "https://www.bornovamun.org/letters",
  },
  twitter: {
    title: "Letters",
    description: "Read the official letters related to BORNOVAMUN'26.",
    card: "summary_large_image",
  },
};

const Letters = () => {
  return (
    <>
      <div className=''>
        <h1 className='text-white text-center text-5xl max-sm:text-3xl max-sm:pt-6 pt-12'>Letter From The <br className='sm:hidden' /> <span className='text-[hsl(42,72%,52%)] font-black'> Secretary General </span></h1>

        <p className='text-white mx-auto w-[1000px] max-sm:w-[350px] max-sm:text-sm text-2xl bg-black/60 relative rounded-4xl max-sm:rounded-2xl max-sm:px-8 max-sm:py-4 max-sm:my-6 px-16 py-8 my-12'>
          Dear Participants<br /> <br />

          It is a great pleasure and honor to invite you to the first  annual session of Bornova Model United Nations . I am excited and proud to serve as the Secretary General of this conference. We worked hard and prepared meticulously with my team to make BornovaMun'26 happen. The aim of this conference is to offer you a conference like no other and to increase the cultural and social event opportunities in our beautiful Bornova. This year's inaugural conference features 7 committees and will welcome over 350 participants to our beloved Bornova. We started working on this conference 6-7 months ago and managed to overcome the challenges we faced with my team. We worked with the same enthusiasm and passion throughout this process. I am excited and looking forward to seeing you at Teknokent College on January 24! If you have any questions about our conference, please feel free to contact me anytime.
          <br /><br /><span className="text-[hsl(42,72%,52%)] font-black">Cem Deniz</span>, Secretary General
          Bornova Model United Nations 2026

          <Image
            src="/mail.svg"
            alt=''
            width={48}
            height={48}
            className='absolute top-8 right-10 max-sm:w-6 max-sm:h-6 max-sm:top-4 max-sm:right-5'
            unoptimized
            draggable={false}
          />
        </p>
      </div>
    </>
  );
};

export default Letters;