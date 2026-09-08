type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

// Helper factories for consistent structured data
import { SITE_NAME, SITE_DESCRIPTION, DEVELOPER_NAME, getSiteUrl } from "@/lib/site";

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "id-ID",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: SITE_NAME,
    url: `${siteUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    founder: {
      "@id": `${siteUrl}/about#person`,
    },
  };
}

export function personJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/about#person`,
    name: DEVELOPER_NAME,
    url: `${siteUrl}/about`,
    description: `${DEVELOPER_NAME} adalah developer yang mengembangkan ${SITE_NAME}, platform streaming anime dengan katalog, episode, dan detail anime.`,
    sameAs: ["https://www.instagram.com/bdn_bnj", "https://github.com/bondanbanuaji/nimeskuy"],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${siteUrl}${it.url}`,
    })),
  };
}

export function webPageJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  isPartOf?: string;
  breadcrumb?: ReturnType<typeof breadcrumbJsonLd>;
}) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    inLanguage: "id-ID",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/about#person`,
    },
    breadcrumb: opts.breadcrumb ? { "@id": `${opts.url}#breadcrumb` } : undefined,
  };
}

export function animeDetailJsonLd(opts: {
  slug: string;
  title: string;
  poster: string;
  synopsis: string[];
  genres: { name: string }[];
  score?: string | null;
  status?: string | null;
}) {
  const siteUrl = getSiteUrl();
  const cleanSynopsis = opts.synopsis.join(" ").slice(0, 500);
  // Only include real, verifiable data from the API. No fabricated ratings/reviews —
  // score shown on page comes from the provider (Sanka), not user reviews on this site,
  // so we omit aggregateRating to keep structured data truthful.
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "@id": `${siteUrl}/anime/${opts.slug}#tvseries`,
    name: opts.title,
    url: `${siteUrl}/anime/${opts.slug}`,
    image: opts.poster,
    description: cleanSynopsis || `Informasi lengkap anime ${opts.title} di ${SITE_NAME}.`,
    genre: opts.genres.map((g) => g.name),
    inLanguage: "id-ID",
  };
}
