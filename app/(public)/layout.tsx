import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/queries/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const brandName = (settings.brand_name as string) ?? "Qulva";
  const logoUrl = (settings.logo_url as string) ?? "";
  const tagline = (settings.tagline as string) ?? "HUMAN OPTIMIZATION THROUGH CLINICAL PRECISION. SCIENCE IS THE ONLY ARCHITECT.";
  const copyrightText = (settings.copyright_text as string) ?? "QULVA. ALL RIGHTS RESERVED.";
  const footerTagline = (settings.footer_tagline as string) ?? "BORN IN THE LAB. TESTED BY SCIENCE.";
  let socialLinks: Record<string, string> = {};
  if (settings.social_links && typeof settings.social_links === "object") {
    socialLinks = settings.social_links as Record<string, string>;
  }

  return (
    <>
      <Header brandName={brandName} logoUrl={logoUrl} />
      <main className="flex-grow">{children}</main>
      <Footer
        brandName={brandName}
        logoUrl={logoUrl}
        tagline={tagline}
        copyrightText={copyrightText}
        footerTagline={footerTagline}
        socialLinks={socialLinks}
      />
    </>
  );
}
