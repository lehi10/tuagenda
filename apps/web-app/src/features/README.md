# Features Structure

This directory contains feature-specific components organized by domain.

## Structure

```
features/
├── dashboard/          # Dashboard feature
│   └── components/     # Dashboard-specific components
├── employees/          # Employees feature
│   └── components/     # Employees-specific components
└── [feature]/          # Other features...
    └── components/
```

## Guidelines

- **Feature components**: Live in `features/[feature]/components/`
- **Shared components**: Live in `components/shared/`
- **UI primitives**: Live in `components/ui/`

## Creating a new feature

1. Create a new directory: `features/[feature-name]/`
2. Add a `components/` subdirectory
3. Build feature-specific components
4. Create an `index.ts` for easy imports
5. Use shared components from `components/shared/`
