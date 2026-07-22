---
agent-notes:
  ctx: "codebase structural overview for todo application"
  deps: [AGENTS.md]
  state: active
  last: "pat@2026-07-22"
  key: ["UPDATE when adding packages, modules, or changing public APIs"]
---
# Code Map

Structural overview of the Todo Application codebase.

## Architecture at a Glance

```
  [User Interaction (DOM / HTML)]
               │
               ▼
       [UI Controller (src/app.js)]
               │
       (calls methods)
               ▼
     [Todo Store (src/todoStore.js)]
         │                  │
         ▼                  ▼
 [LocalStorage]     [Unit Tests (tests/todoStore.test.js)]
```

## Package / Module Summaries

### Todo Application Core

**Purpose:** Task management, state persistence, filtering, and interactive UI.

| Module | Key Exports | Purpose |
|--------|------------|---------|
| `src/todoStore.js` | `TodoStore` | Pure logic for managing todo items, filters, and persistence |
| `tests/todoStore.test.js` | Unit tests | Node test runner test suite for `TodoStore` |
| `src/app.js` | DOM Initialization | Controllers connecting store state changes to DOM elements |
| `index.html` | HTML document | Accessible semantic markup for task management interface |
| `styles.css` | CSS styling | Glassmorphism UI tokens, dark theme, and micro-animations |

## Test Inventory

| Module | Test File | Focus |
|--------|-----------|-------|
| Todo Store | `tests/todoStore.test.js` | Add, toggle, delete, filter, clear completed, storage |
