// types.ts

export type CommitteeType = {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
    description: any[]; // Portable Text content
    documents?: {
        url: string;
        title: string;
    }[];
};

export type SecretariatType = {
    id: number;
    name: string;
    role: string;
    slug: string;
    imageUrl: string;
    bio: any[]; // Portable Text content
    instagram?: string;
};