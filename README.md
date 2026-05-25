> [!NOTE]
> This project is still being actively worked on. Once it reaches a more finalized version, the `README.md` file will be updated to reflect the latest architecture, features, and framework improvements.
# Frontend Foundations

A modern Front-End Automation Testing framework built with Playwright, TypeScript, and the Page Object Model (POM) architecture.

This project represents my growing expertise in Front-End Quality Engineering and UI automation, focusing on:

- scalable Playwright architecture
- maintainable automation patterns
- accessibility-first selectors
- reliable end-to-end testing
- clean TypeScript implementation
- reusable Page Object Models
- modern QE best practices

---

## Goals of This Project

The main purpose of this repository is to demonstrate my practical knowledge in:

- Front-End Automation
- UI Functional Testing
- End-to-End Testing
- Playwright + TypeScript
- Test Architecture Design
- Page Object Model implementation
- Locator strategy optimization
- Maintainable automation frameworks
- Scalable test organization
- Cross-browser testing
- Automation best practices

This project is continuously evolving as I keep learning and improving my QA Engineering skills.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Main programming language |
| Playwright | End-to-End automation |
| Node.js | Runtime environment |
| Page Object Model | Framework architecture |
| HTML Reports | Test reporting |

---

## Features Implemented

### Authentication Testing

- Valid login flows
- Invalid credentials validation
- Locked user validation
- Error handling verification
- Logout validation

### Inventory / Home Page Testing

- Product visibility validation
- Product information verification
- Cart badge validation
- Add/remove cart interactions
- Product navigation testing
- Burger menu functionality
- Reset app state validation
- Sorting validation

### Product Details Testing

- Product information validation
- Add/remove cart actions
- Cart synchronization
- Navigation flows
- Product image validation

### Checkout Testing

- Successful checkout flow
- Checkout validation errors
- Missing required fields validation
- Order completion verification

---

## Framework Architecture

```text
Frontend-Foundations
│
├── pages/
│   ├── basePage.ts
│   ├── loginPage.ts
│   ├── inventoryPage.ts
│   ├── cartPage.ts
│   ├── checkoutPage.ts
│   └── productDetailPage.ts
│
├── tests/
│   ├── login.spec.ts
│   ├── home.spec.ts
│   ├── items.spec.ts
│   └── checkout.spec.ts
│
├── playwright.config.ts
└── package.json
```

---

## Automation Architecture

This framework follows the **Page Object Model (POM)** design pattern to improve:

- maintainability
- readability
- scalability
- reusability

Each page has its own dedicated class containing:

- locators
- reusable actions
- helper methods
- assertions support

---

## Locator Strategy

This framework follows Playwright best practices for stable selectors.

Priority order used throughout the project:

```text
role/test-id → id → name → CSS → XPath
```

Examples:

```ts
page.getByRole('button', { name: 'Login' })

page.getByTestId('shopping-cart-link')

page.getByPlaceholder('Username')
```

XPath selectors are intentionally avoided to reduce brittleness and improve maintainability.

---

## Best Practices Applied

- Page Object Model (POM)
- Reusable methods
- Centralized locators
- Accessibility-friendly selectors
- Async/Await implementation
- Minimal flaky selectors
- Test isolation
- Shared setup with beforeEach
- Cross-browser configuration
- Failure screenshots/traces/videos
- Clean TypeScript typing

---

## Running the Project

### Install dependencies

```bash
npm install
```

### Install Playwright browsers

```bash
npx playwright install
```

### Run all tests

```bash
npx playwright test
```

### Run tests in UI mode

```bash
npx playwright test --ui
```

### Run a specific test file

```bash
npx playwright test tests/login.spec.ts
```

### Open HTML report

```bash
npx playwright show-report
```

---

## Browser Coverage

Current configuration supports:

- Chromium
- Firefox
- WebKit

## What This Project Demonstrates

This repository showcases my ability to:

- design scalable automation frameworks
- build maintainable UI automation
- implement Playwright best practices
- write clean TypeScript automation
- create reusable Page Objects
- improve test stability
- structure real-world QE projects
- apply modern QA Engineering principles

## Author

Alexander Bocanegra

GitHub: https://github.com/OdinJacques
