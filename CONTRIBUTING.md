# Contributing to Cold Dialer

Thank you for your interest in contributing to Cold Dialer! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/cold-dialer.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Run `npm run lint` before committing
- Run `npm run build` to verify no type errors

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add CSV import for leads`
- `fix: resolve softphone audio issue`
- `docs: update SIP provider guide`
- `refactor: extract auth into provider`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all checks pass
4. Request review from maintainers

## Reporting Issues

Use GitHub Issues with the appropriate template:
- Bug reports: Include steps to reproduce
- Feature requests: Describe the use case
- SIP provider issues: Include provider and configuration

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
