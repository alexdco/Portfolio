# Components

## Overview

All UI for the portfolio. `PortfolioContent.tsx` stacks the page sections in order, each section fetches its own Sanity data, and a few client components handle interactivity (dock, sidebar, theme, chat, contact form). `ui/` holds generated shadcn and Aceternity primitives.

## Key files

| File | Owns |
| --- | --- |
| `PortfolioContent.tsx` | Section order on the home page |
| `sections/*.tsx` | One async Server Component per content type, each with its own GROQ query |
| `FloatingDock.tsx` / `FloatingDockClient.tsx` | Server fetch of navigation, then client rendering (the server and client split pattern) |
| `DynamicIcon.tsx` | Renders a Tabler icon by the name stored in Sanity, with a fallback |
| `Chat.tsx` / `ChatWrapper.tsx` | ChatKit chat panel; the wrapper fetches the profile, the client gets a session from `app/actions/create-session.ts` |
| `ContactForm.tsx` | Client form calling the `submitContactForm` Server Action in a transition |
| `SidebarToggle.tsx`, `ProfileImage.tsx` | Clerk sign in gate in front of the right side chat sidebar |
| `ui/` | shadcn (new york) and Aceternity primitives |

## Conventions

- A section is an async Server Component: a `defineQuery` constant at the top, `await sanityFetch({ query })`, and `return null` when there is no data, so empty content hides the section.
- When a section needs interactivity, keep the fetch in the server file and move the UI into a sibling `*Client.tsx` with `"use client"`.
- Type props from the generated `*QUERYResult` types in `@/sanity.types` rather than writing interfaces by hand.
- Render Sanity images with `next/image` and `urlFor()` (only `cdn.sanity.io` is allowed in `next.config.ts`), and rich text with `PortableText`.
- Add shadcn parts with the shadcn CLI (`npx shadcn@latest add <name>`, or `@aceternity/<name>` for the Aceternity registry) and leave files in `ui/` close to what the CLI generated.

## Gotchas

- The chat requires a signed in Clerk user: `createSession` throws without one, and it needs `OPENAI_API_KEY` plus `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`. The ChatKit script itself loads in the portfolio layout.
- `CREATE_SESSION_ENDPOINT` in `lib/config.ts` points to `/api/create-session`, which does not exist; sessions come from the Server Action instead.
- `@portabletext/react` is used by sections but is not a direct dependency in `package.json` (it arrives through `next-sanity`).

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
