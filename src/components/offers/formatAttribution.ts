export function formatAttribution(author: string, role?: string): string {
  return role ? `${author}, ${role}` : author;
}
