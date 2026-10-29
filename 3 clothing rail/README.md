# Clothing Rail

An interactive, responsive clothing rail built with React, TypeScript, Vite, and Tailwind CSS.

## Development

```sh
npm install
npm run dev
```

Run the production build and lint checks with:

```sh
npm run build
npm run lint
```

The reusable rail component lives in `src/components/ui/product-rail-gallery.tsx`, following the `components/ui` convention used by shadcn/ui. Its demo garments are defined in `src/rail-items.ts`.

The project is configured for Tailwind CSS v4 through the Vite plugin. To add shadcn/ui components later, initialize shadcn with the Vite preset and point its aliases at `src/components` and `src/lib`; keeping primitives in `src/components/ui` makes them reusable and keeps the configured component import path consistent.
