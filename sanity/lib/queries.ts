// sanity/lib/queries.ts

import { groq } from "next-sanity";

// Queries for the main listing pages
export const COMMITTEES_QUERY = groq`*[_type == "committee"] {
  id,
  name,
  description,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "dimensions": image.asset->metadata.dimensions,
  externalLink
}`;

export const SECRETARIAT_QUERY = groq`*[_type == "secretariat"] {
  id,
  name,
  role,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "dimensions": image.asset->metadata.dimensions
}`;

// Queries for individual pages (Dynamic Routes)
export const COMMITTEE_BY_SLUG_QUERY = groq`*[_type == "committee" && slug.current == $slug][0] {
  id,
  name,
  "imageUrl": image.asset->url,
  description,
  documents[] {
    "url": asset->url,
    title
  }
}`;

export const SECRETARIAT_BY_SLUG_QUERY = groq`*[_type == "secretariat" && slug.current == $slug][0] {
  id,
  name,
  role,
  "imageUrl": image.asset->url,
  bio,
  instagram
}`;