# Hero Section Designs

A collection of modern, immersive hero-section experiments built to explore visual storytelling, motion, and interaction on the web. Each numbered folder is a standalone project that you can run and explore independently.

## Projects

| Project | Experience |
| --- | --- |
| [01 — Into the Wild](./1/) | An interactive nature-photo gallery with a rotating works wheel, keyboard-accessible controls, and a responsive layout. |
| [02 — Nature Journey](./2/) | A scroll-driven hero experience featuring a layered 3D photo tunnel, elegant typography, and a calm editorial look. |
| [03 — Clothing rail](./3 clothing rail/) | An interactive clothing website featuring smooth animations, draggable clothing items, and a premium shopping experience. Designed to make online fashion shopping more engaging with a clean, modern UI. |

## Built With

- React
- Vite
- CSS
- Framer Motion in Project 01

## Getting Started

Choose a project and run it from its own folder:

```bash
cd 1
npm install
npm run dev
```

Or start the second project:

```bash
cd 2
npm install
npm run dev
```

Vite will print the local URL in your terminal. Open it in a browser to view the selected hero experience.

## Available Scripts

Run these commands inside either project folder:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Build the project for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Project Structure

```text
.
├── 1/                 # Interactive nature gallery
│   ├── public/        # Public media and icons
│   └── src/           # React components, styles, and image assets
├── 2/                 # Scroll-driven 3D photo experience
│   ├── public/        # Public media and icons
│   └── src/           # React app, styles, and image assets
└── README.md
```

Each project has its own `package.json`, dependencies, and Vite configuration. Install dependencies and run scripts from the project folder you want to work on.
