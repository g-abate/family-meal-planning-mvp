# Family Meal Planning MVP

A modern, Progressive Web App (PWA) for family meal planning with prep optimization. Built with React, TypeScript, and designed for the "aha moment" in under 2 minutes.

## 🚀 Features

- **4-Step Setup Wizard** - Quick meal planning configuration
- **Smart Meal Planning** - Personalized suggestions based on family preferences
- **Prep Optimization** - Organized prep checklists with session grouping
- **PWA Support** - Installable app with offline functionality
- **Responsive Design** - Works on desktop and mobile devices
- **Accessibility First** - Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Database**: SQLite with FTS5 full-text search
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest (unit) + Playwright (E2E)
- **PWA**: Vite PWA Plugin + Workbox
- **Code Quality**: ESLint + Prettier + Husky
- **CI/CD**: GitHub Actions with AI PR reviews

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
├── forms/              # Form components and validation
├── services/           # Business logic and API services
├── stores/             # Zustand state management
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── schemas/            # Zod validation schemas
└── test/               # Test utilities and setup

tests/
└── e2e/                # End-to-end tests

public/
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── workbox-config.js  # Workbox configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/g-abate/family-meal-planning-mvp.git
   cd family-meal-planning-mvp
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run unit tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

```bash
pnpm test:e2e
```

### Test Coverage

```bash
pnpm test:coverage
```

## 📱 PWA Features

This app is a Progressive Web App with:

- **Offline Support** - Works without internet connection
- **Installable** - Can be installed on devices
- **Service Worker** - Background sync and caching
- **Manifest** - App metadata and icons

## 🎨 Design System

Built with a custom design system featuring:

- **Luxurious Minimalism** - Clean, elegant interface
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 AA compliant
- **Dark/Light Mode** - Theme support (coming soon)

## 🚧 Development Status

### ✅ Completed (Task 1.0)

- [x] Project setup and configuration
- [x] PWA implementation
- [x] Testing infrastructure
- [x] Code quality tools

### 🚧 In Progress (Task 2.0)

- [ ] Database infrastructure
- [ ] ETL pipeline
- [ ] Recipe management

### 📋 Planned

- [ ] Meal planning wizard
- [ ] Prep optimization
- [ ] User preferences
- [ ] Offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components with [React](https://react.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Testing with [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)
- PWA features with [Vite PWA Plugin](https://github.com/vite-pwa/vite-plugin-pwa)
