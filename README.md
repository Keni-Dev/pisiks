# PISIKS – Motion Physics Simulator

An interactive kinematics playground for exploring how objects move under constant acceleration. PISIKS lets students and teachers experiment with real-time simulations, visualize velocity/displacement graphs, and access ready-made learning content – all in a responsive interface that works on phones, tablets, and desktops.

<p align="center">
  <a href="https://Keni-Dev.github.io/pisiks">View the live demo →</a>
</p>

## Features

- **Dynamic motion controls** – Toggle between uniform, accelerated, and free-fall motion, adjust initial velocity / acceleration / duration, and choose themed object presets for quick setup.
- **Responsive layouts** – Three viewing modes (classic, side-by-side, overlay) with automatic defaults for desktop and mobile, plus a manual toggle in the header.
- **Real-time physics data** – Velocity, displacement, acceleration, and elapsed time update continually while the simulation runs.
- **Downloadable motion graphs** – Plot velocity–time and displacement–time charts using Recharts, then export data as CSV or crisp PNG snapshots that scale to any screen.
- **Guided learning** – Help and learning panels surface formulas, tips, and example scenarios to support classroom use.
- **Accessible UI** – Keyboard-friendly controls, aria labels, and focus states make the simulator approachable for everyone.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind utility classes (via PostCSS) and custom CSS
- **Charts & export**: Recharts, html2canvas
- **Icons**: lucide-react

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Keni-Dev/pisiks.git
cd pisiks

# Install dependencies
npm install
```

### Development

```bash
# Start the Vite dev server (LAN-accessible)
npm run dev
```

Vite will print both a local URL (typically `http://localhost:5173`) and a LAN URL, making it easy to test on mobile devices.

### Production Build

```bash
# Type-check and bundle the project
npm run build

# Preview the optimized output locally
npm run preview
```

### Deployment

The project is configured for GitHub Pages.

```bash
# Build and publish dist/ to the gh-pages branch
npm run deploy
```

## Project Structure

```
.
├── public/              # Static assets served as-is
├── src/
│   ├── components/      # UI building blocks (controls, panels, modals)
│   │   └── ui/          # Reusable form & layout primitives
│   ├── hooks/           # Animation loop, canvas helpers, storage utilities
│   ├── lib/             # Physics formulas, drawing utils, presets, types
│   ├── styles/          # Tailwind entry and global styles
│   ├── App.tsx          # Layout orchestration & core state management
│   └── main.tsx         # React entry point
├── vite.config.ts       # Vite configuration
└── README.md
```

## NPM Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with LAN access |
| `npm run build` | Type-check and bundle for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run deploy` | Build and publish to GitHub Pages |

## Contributing

Issues and pull requests are welcome. If you plan to contribute:

1. Fork the repository and create a feature branch (`feature/your-idea`).
2. Update or add tests/documentation if needed.
3. Run `npm run lint` and `npm run build` to verify everything passes.
4. Open a pull request describing your changes.

## Contact

For questions or suggestions, open an issue on GitHub or reach out to **@Keni-Dev**.

---

Built with ❤️ to make physics lessons more interactive and fun.
