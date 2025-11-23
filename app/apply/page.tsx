// app/apply/page.tsx

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply to be a part of BORNOVAMUN'26.",
};

const applications = [
  { id: 'delegate', title: 'Delegate', img: '/applications/delegate.webp', desc: 'Represent a nation and debate global issues.' },
  { id: 'press', title: 'Press', img: '/applications/press.webp', desc: 'Capture the moments and report the news.' },
  { id: 'pr', title: 'Public Relations', img: '/applications/pr.webp', desc: 'Manage communications and media presence.' },
  { id: 'admin', title: 'Admin', img: '/applications/admin.webp', desc: 'Ensure the smooth operation of the conference.' },
  { id: 'delegation', title: 'Delegation', img: '/applications/delegation.webp', desc: 'Apply as a school or group delegation.' },
];

const Apply = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl max-sm:text-4xl mb-6 text-center text-[hsl(42,72%,52%)] font-bold">
          Apply Now
        </h1>
        <p className="text-center text-gray-300 text-xl mb-16 max-w-2xl mx-auto">
          Choose your role and be part of the legacy. Join us at BORNOVAMUN'26 for an unforgettable experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/apply/${app.id}`}
              className="group relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_hsl(42,72%,52%,0.3)]"
            >
              {/* Background Image */}
              <div className="relative h-[400px] w-full">
                 <Image 
                  src={app.img}
                  alt={`Apply ${app.title}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0A1938] via-[#0A1938]/40 to-transparent opacity-90 transition-opacity duration-300" />
                
                {/* Border effect */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-[hsl(42,72%,52%)] transition-colors duration-300 rounded-3xl z-20 pointer-events-none" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-[hsl(42,72%,52%)] transition-colors">
                  {app.title}
                </h2>
                <p className="text-gray-300 mb-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {app.desc}
                </p>
                
                <span className="flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all duration-300">
                  Application Form 
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apply;