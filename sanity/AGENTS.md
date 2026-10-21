# Sanity (content layer)

## Overview

Sanity is the single source of content for the portfolio. This folder holds the content schemas, the Studio desk structure, and the clients the app uses to read and write. The Studio is embedded in the Next app at `/studio` (config in the root `sanity.config.ts`).

## Key files

| File | Owns |
| --- | --- |
| `env.ts` | `projectId`, `dataset`, `apiVersion`; throws at import if the project ID or dataset is missing |
| `lib/client.ts` | Read only client (CDN on), used by the Live API |
| `lib/live.ts` | `sanityFetch` and `<SanityLive />`; the only way components should read content |
| `lib/serverClient.ts` | Write client using `SANITY_SERVER_API_TOKEN`; server code only |
| `lib/image.ts` | `urlFor()` image URL builder |
| `schemaTypes/index.ts` | Registers every document type; a new type must be added here |
| `structure.ts` | Studio sidebar, singletons, and contact inbox filters |
| `../sanity.types.ts` | Generated query result types (do not edit) |

## Commands

```bash
# After changing a schema or any defineQuery string
npm run typegen

# Import the sample content into a dataset (default: production)
bash Data/import-all.sh <dataset>
```

## Conventions

- One document type per file in `schemaTypes/`, default exported via `defineType`, fields via `defineField`.
- Typegen scans `app`, `components`, and `sanity` for `defineQuery` calls. Name each query `SOMETHING_QUERY` so its type comes out as `SOMETHING_QUERYResult`.
- Images use `hotspot: true` and carry an `alt` field.
- Contact submissions are written with `status: "new"`; the Studio inbox splits them into `new` and `archived` by that field.

## Gotchas

- `profile` and `siteSettings` are singletons by fixed ID only (`singleton-profile`, `singleton-siteSettings`, set in `structure.ts`). Nothing in the schema blocks a second document, so query them by `_id`, not by `_type`.
- `serverClient` must never be imported into a `"use client"` file; it carries a write token.
- The standalone Studio (`sanity dev`, `sanity build` into `dist/`) reads `SANITY_STUDIO_*` env vars; the Next app reads `NEXT_PUBLIC_SANITY_*`. `env.ts` and `sanity.cli.ts` accept either.

## Agent skills

- [sanity-best-practices](../.agents/skills/sanity-best-practices/): `sanity-io/agent-toolkit`, GROQ, clients, Studio and `next-sanity` usage
- [content-modeling-best-practices](../.agents/skills/content-modeling-best-practices/): `sanity-io/agent-toolkit`, designing schemas and document types
- [portable-text-serialization](../.agents/skills/portable-text-serialization/): `sanity-io/agent-toolkit`, rendering rich text (blog, experience) with `PortableText`

MCP servers: Sanity (recommended, hosted at mcp.sanity.io, set up with `npx sanity@latest mcp configure`)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
