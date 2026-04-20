# AGENTS.md

## Stack
- React
- TypeScript
- styled-components

## Code conventions
- Use TypeScript for all new files. Prefer `.ts` and `.tsx`.
- Use functional components only. Do not create class components.
- Type all props with `type` or `interface`.
- Use `styled-components` for component styling.
- Avoid inline styles in JSX unless explicitly requested.
- Prefer PascalCase for component filenames.

## Component structure
When creating a component, use this order:
1. imports
2. types
3. styled components
4. component implementation
5. export

## Project structure
Prefer this folder structure:
- `src/components`
- `src/pages`
- `src/hooks`
- `src/styles`
- `src/utils`

## Quality checks
- Run ESLint before finishing significant changes.
- Keep code Prettier-compatible.
- Respect React Hooks rules.
- Keep TypeScript strict-mode compatible.

## Testing
- Add unit tests for non-trivial logic when touching business behavior.
- Prefer React Testing Library for component tests.

## Decision defaults
- Do not introduce CSS/SCSS files if `styled-components` already covers the need.
- Do not use default exports unless the file already follows that pattern.
- Match the existing codebase style before applying generic preferences.

## Working style
- Make the smallest reasonable change that solves the task.
- Do not refactor unrelated files.
- Before finishing, run only the relevant checks for modified files when possible.
- Preserve public component APIs unless the task requires changing them.
- Follow existing local patterns when they conflict with generic preferences.