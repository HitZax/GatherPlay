# Contributing to GatherPlay

Thank you for your interest in contributing to GatherPlay! This document provides guidelines and instructions for contributing.

## 📋 Code of Conduct

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/GatherPlay.git
   cd GatherPlay
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/originalowner/GatherPlay.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Workflow

1. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary

2. **Test your changes**
   ```bash
   npm run dev
   # Test manually in browser
   # Run tests when available
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Submit!

## 📝 Pull Request Guidelines

- **Title:** Clear and descriptive
- **Description:** 
  - What changes were made
  - Why they were made
  - How to test them
- **Screenshots:** Include for UI changes
- **Tests:** Add tests if applicable
- **Documentation:** Update README if needed

## 🎨 Code Style

- Use TypeScript for type safety
- Follow existing patterns and conventions
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### TypeScript

```typescript
// Good
interface GameSettings {
  timerMinutes: number;
  wordDifficulty: 'easy' | 'medium' | 'hard';
}

function createGame(settings: GameSettings): Game {
  // Implementation
}

// Bad
function createGame(settings: any) {
  // Implementation
}
```

### React Components

```typescript
// Good
interface PlayerCardProps {
  player: Player;
  onKick?: (playerId: string) => void;
}

export function PlayerCard({ player, onKick }: PlayerCardProps) {
  return <div>{player.name}</div>;
}

// Bad
export function PlayerCard(props: any) {
  return <div>{props.player.name}</div>;
}
```

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test in multiple browsers if possible

## 📦 Adding New Games

To add a new game:

1. **Add game type** to `shared/src/types.ts`
2. **Add game config** to `shared/src/constants.ts`
3. **Create game component** in `client/src/components/games/`
4. **Add game logic** to server if needed
5. **Update documentation**

## 🐛 Reporting Bugs

**Before submitting:**
- Check if bug already reported
- Try to reproduce the bug
- Note your environment (OS, browser, etc.)

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
```

## 💡 Feature Requests

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution**
What you want to happen.

**Describe alternatives**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
```

## 📚 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## ✅ Checklist Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Commit messages follow convention

## 🤝 Getting Help

- Join our [Discord](https://discord.gg/gatherplay)
- Check [Discussions](https://github.com/yourusername/GatherPlay/discussions)
- Open an [Issue](https://github.com/yourusername/GatherPlay/issues)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to GatherPlay! 🎉
