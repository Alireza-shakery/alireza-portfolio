export const site = {
  // Keep null until the owner configures a verified production origin.
  url: productionOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  socialImage: '/images/og/social.png',
};
function productionOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.origin : null;
  } catch {
    return null;
  }
}
