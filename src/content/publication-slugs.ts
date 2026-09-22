/** Build-time slug collision check for the shared /publikacje/[slug] namespace (K-76). */
export function validatePublicationSlugCollisions(
  publicationSlugs: string[],
  articleSlugs: string[],
): void {
  const articleSet = new Set(articleSlugs);
  const collisions = publicationSlugs.filter((slug) => articleSet.has(slug));

  if (collisions.length > 0) {
    throw new Error(
      `Publication/article slug collision (build aborted): ${collisions.join(", ")}`,
    );
  }
}
