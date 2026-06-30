# SEO & Metadata Strategy

This document outlines the Search Engine Optimization (SEO) and OpenGraph (OG) metadata architecture for the BUCC Web Portal. It serves as a guide for ensuring maximum discoverability and rich social sharing previews.

## 1. Global Defaults

The foundation of our SEO strategy is established in `src/app/layout.tsx`.

- **MetadataBase:** Set to `https://www.bracucc.org` to ensure all relative asset paths (like OG images) resolve correctly.
- **Title Template:** Uses `%s | BUCC` to automatically append the club abbreviation to specific page titles (e.g., "Tech Fest 2026 | BUCC").
- **Keywords:** A robust array of core keywords (`BRAC University`, `Computer Club`, `Tech Community`, etc.) applied globally.
- **Fallback Image:** A default `cover.jpeg` is served for any route that does not specify a unique OpenGraph image.

## 2. Dynamic Metadata Generation

For content-heavy, dynamic routes (Blogs, Projects, Events, Press Releases), we leverage Next.js 16's `generateMetadata` API. This allows us to fetch data server-side and inject specific meta tags into the `<head>` before the page is sent to the client.

### Supported Dynamic Routes

- **Blogs** (`/blogs/[id]`)
- **Projects** (`/projects/[slug]`)
- **Press Releases** (`/publications/press-releases/[id]`)
- **Events** (`/events/[id]`)
- **Member Profiles** (`/m/[slug]`): Generates personalized titles and open graph descriptions based on the member's name, designation, department, and bio. It uses the member's uploaded avatar image as the OpenGraph target image (falling back to `/assets/bucc-icon.svg`). Checks database parameters `isPublicProfile: true` and matches against the lowercase `profileSlug` index before outputting metadata to search crawlers.

### Implementation Pattern

When building a new dynamic route, adhere to the following pattern to guarantee rich social sharing:

```typescript
import type { Metadata } from "next";

// 1. Define the generateMetadata function
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // 2. Fetch the data
  const data = await getYourData(id);

  // 3. Handle 404s gracefully
  if (!data) return { title: "Not Found" };

  // 4. Return the comprehensive Metadata object
  return {
    title: data.title,
    description: data.shortDescription,
    openGraph: {
      title: data.title,
      description: data.shortDescription,
      type: "article", // or "website"
      images: [
        {
          url: data.coverImage || "/images/cover.jpeg", // Always provide a fallback
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.shortDescription,
      images: [data.coverImage || "/images/cover.jpeg"],
    },
  };
}
```

## 3. Server Components Mandate

For maximum SEO efficacy, **content-heavy detail pages must be Server Components**. 

If a page relies entirely on client-side fetching (e.g., `useQuery` from `@tanstack/react-query` inside a `"use client"` directive at the top level), search engine crawlers and social media link-preview bots may only index the loading spinner state.

**Rule of Thumb:**
- Use Server Components to fetch data, generate metadata, and render the initial layout.
- If interactivity is needed (e.g., a "Like" button or a complex form), abstract *only that specific piece* into a separate Client Component and import it into the Server Component.

## 4. Image Optimization

To ensure fast load times, which positively impacts SEO ranking:
- Prefer the Next.js `<Image />` component for static assets.
- For external URLs (like Unsplash or Cloudinary), ensure the domains are whitelisted in `next.config.mjs` if using Next.js Image optimization, or use standard `<img>` tags if optimization is handled externally.
