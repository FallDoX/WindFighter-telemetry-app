# Contributing

<!-- GSD-MARKER:DOC-GENERATED -->

Thank you for your interest in contributing to WindFighter Telemetry App!

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Modern web browser

### Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/WindFighter-telemetry-app.git
cd WindFighter-telemetry-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Branch Strategy

- `main` - Production branch
- Feature branches - For new features
- Use descriptive branch names: `feature/acceleration-comparison`, `fix/chart-bug`

### Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes
3. Run tests:
```bash
npm run test:unit
npm run test
```

4. Commit changes:
```bash
git add .
git commit -m "feat: Add your feature description"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

6. Create pull request

## Commit Message Convention

Follow conventional commits:

```
feat: Add acceleration comparison feature
fix: Fix chart rendering bug on mobile
docs: Update README with new features
refactor: Improve performance of data parsing
test: Add unit tests for acceleration module
chore: Update dependencies
style: Fix code formatting
```

## Code Style

### TypeScript

- Use strict TypeScript mode
- Define interfaces for all data structures
- Use type inference where appropriate
- Avoid `any` type

### React

- Use functional components with hooks
- Use `memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Follow React best practices

### CSS/Tailwind

- Use Tailwind utility classes
- Follow existing color scheme
- Use responsive prefixes (`md:`, `lg:`)
- Maintain mobile-first approach

## Testing

### Unit Tests

Write unit tests for:
- Utility functions
- Custom hooks
- Component logic

```bash
npm run test:unit
npm run test:unit:coverage
```

### E2E Tests

Write E2E tests for:
- User flows
- Critical features
- Cross-browser compatibility

```bash
npm run test
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new features
4. Follow code style guidelines
5. Write descriptive commit messages

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

## Reporting Issues

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information

### Feature Requests

Include:
- Description of the feature
- Use case
- Proposed implementation (if known)
- Alternatives considered

## Documentation

### Updating Documentation

- Update README.md for user-facing changes
- Update docs/ for technical changes
- Add inline comments for complex code
- Keep documentation in sync with code

### Adding New Features

1. Update relevant documentation
2. Add examples if helpful
3. Update type definitions
4. Add tests
5. Update CHANGELOG.md (if applicable)

## Questions?

- Open an issue for questions
- Check existing issues first
- Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the project's license.
