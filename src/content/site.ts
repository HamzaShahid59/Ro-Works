/**
 * Business details and content that is the same in every language.
 * Edit this file to update contact info, projects and reviews.
 */
export const site = {
  name: "RoWorks",
  phoneDisplay: "+32 493 87 70 71",
  phoneHref: "tel:+32493877071",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.roworks.be",
};

export type ServiceKey = "kitchens" | "bathrooms" | "basements" | "flooring" | "wholeHome";

/**
 * Projects: add items here when you have photos.
 * Put images in /public/images and reference them as "/images/your-file.jpg".
 * The Projects section stays hidden while this list is empty.
 */
export type Project = {
  image: string;
  title: string;
  type: ServiceKey;
  location: string;
};
export const projects: Project[] = [
  // { image: "/images/kitchen-gent.jpg", title: "Open-plan kitchen", type: "kitchens", location: "Gent" },
];

/**
 * Reviews: add real customer reviews here (keep them in the language they were written in).
 * The Reviews section stays hidden while this list is empty.
 */
export type Review = { text: string; name: string; location: string };
export const reviews: Review[] = [
  // { text: "Great work, finished on time.", name: "Jan P.", location: "Antwerpen" },
];

/** Optional hero photo, e.g. "/images/hero.jpg". Leave null to show the graphic panel. */
export const heroImage: string | null = null;
