# Stock App

A modern stock market application built with React, TypeScript, and Vite. This project demonstrates a scalable architecture with a component-driven design system, state management preparation, and API integration ready for real-time stock data.

## 🚀 Tech Stack

| Category          | Technology                                                |
| ----------------- | --------------------------------------------------------- |
| **Framework**     | React 19.2.0, React DOM 19.2.0                            |
| **Build Tool**    | Vite (rolldown-vite 7.2.2) with HMR                       |
| **Language**      | TypeScript 5.9.3                                          |
| **Styling**       | Tailwind CSS 4.1.17 with CSS Variables                    |
| **UI Components** | shadcn/ui (Radix UI primitives, Class Variance Authority) |
| **Icons**         | Lucide React 0.553.0                                      |
| **Code Quality**  | ESLint 9.39.1, Prettier 3.6.2, TypeScript-ESLint 8.46.3   |
| **Git Hooks**     | Husky 9.1.7 + lint-staged for pre-commit checks           |

## 📁 Project Structure

stock-app/
├── src/
│ ├── components/
│ │ ├── business/ # Domain-specific components (Pages, Features)
│ │ │ └── (future: StockList, Portfolio, etc.)
│ │ └── ui/ # Reusable UI components (Button, Input, etc.)
│ │ └── button.tsx # Base button component with variants
│ ├── hooks/ # Custom React hooks
│ │ └── (future: useStockData, useCaching, etc.)
│ ├── lib/
│ │ └── utils.ts # Utility functions (cn for Tailwind merging)
│ ├── types/ # TypeScript type definitions
│ │ └── (future: Stock, Portfolio, API types)
│ ├── utils/ # Standalone utilities
│ │ └── (future: Formatting, validation, etc.)
│ ├── App.tsx # Root component
│ ├── main.tsx # React entry point
│ └── index.css # Global styles
├── eslint.config.ts # ESLint flat config with Prettier integration
├── .prettierrc.json # Prettier configuration (single quotes)
├── vite.config.ts # Vite configuration with Tailwind plugin
├── tsconfig.json # TypeScript configuration with @ path alias
├── components.json # shadcn/ui configuration
└── package.json

### Data Flow Diagrams

## 🎨 Design System

This project uses a **component-driven design system** built on:

1. **Radix UI**: Unstyled, accessible components as the foundation
2. **Tailwind CSS**: Utility-first CSS with CSS variables for theming
3. **shadcn/ui**: Copy-paste component library combining both
4. **Class Variance Authority (CVA)**: Type-safe variant management

## 🔄 Development Workflow

### Code Quality

Automated checks via Husky pre-commit hooks:

```bash
# Runs before commit:
pnpm lint-staged  # ESLint + Prettier on staged files
```

### Scripts

```bash
# Development
pnpm dev           # Start dev server with HMR
pnpm build         # Build for production
pnpm preview       # Preview production build
pnpm lint          # Run ESLint on all files
```

## 🛠️ Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
