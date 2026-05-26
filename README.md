# Frontend Foundations

A modern Front-End Automation Testing framework built with Playwright, TypeScript, and scalable automation architecture principles.

This project represents my growing expertise in Front-End Quality Engineering and UI automation, focusing on:

- scalable Playwright architecture
- maintainable automation patterns
- accessibility-first selectors
- reliable end-to-end testing
- clean TypeScript implementation
- reusable Page Object Models
- centralized locator management
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

This project continuously evolves as I improve my QA Engineering and automation architecture skills.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Main programming language |
| Playwright | End-to-End automation |
| Node.js | Runtime environment |
| Page Object Model | Framework architecture |
| Centralized Locators | Shared selector architecture |
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
- Cart synchronization validation
- Accessibility-oriented locator validation

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
- End-to-end checkout workflow

### Navigation & Menu Testing

- About page redirection validation
- Burger menu interactions
- Navigation link validations

---

## Framework Architecture

```text
Frontend-Foundations
│
├── locators/
│   ├── login.locators.ts
│   ├── inventory.locators.ts
│   ├── cart.locators.ts
│   ├── checkout.locators.ts
│   └── productDetails.locators.ts
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
│   ├── checkout.spec.ts
│   ├── about.spec.ts
│   ├── cart.spec.ts
│   └── menu.spec.ts
│
├── playwright.config.ts
└── package.json
```

---

## Automation Architecture

This framework follows the **Page Object Model (POM)** design pattern combined with centralized locator abstraction to improve:

- maintainability
- readability
- scalability
- reusability
- selector consistency

Each page contains:

- reusable actions
- helper methods
- page-specific flows
- assertion support

Selectors are centralized in dedicated locator files to reduce duplication and simplify maintenance across the framework.

---

## Locator Abstraction Architecture

The framework uses dedicated locator files to centralize selectors and standardize Playwright locator usage.

This architecture helps:

- reduce selector duplication
- keep selectors consistent across Pages
- simplify Page Object logic
- improve scalability
- make selector updates easier
- standardize locator strategy

Example:

```ts
export const loginLocators = {
  usernameInput: 'Username',
  passwordInput: 'Password',
  loginButton: {
    role: 'button',
    name: 'Login',
  },
};
```

Pages consume centralized locators instead of redefining selectors repeatedly.

---

## Locator Architecture

The framework uses dedicated `.locators.ts` files to centralize selectors and standardize locator usage across Page Objects.

This architecture helps:

- reduce selector duplication
- improve selector consistency
- simplify Page Object maintenance
- separate selectors from page actions
- improve scalability and readability

Example:

```ts
export const loginLocators = {
  usernameInput: {
    role: 'textbox',
    name: 'Username',
  },

  loginButton: {
    role: 'button',
    name: 'Login',
  },
};
```

Page Objects consume shared locators instead of redefining selectors repeatedly.

---

## Locator Strategy

The framework follows Playwright best practices for stable and maintainable selectors.

Preferred selector priority:

```text
Role → TestId → Id → Name → CSS → XPath
```

The project prioritizes:

- semantic Playwright locators
- accessibility-aware selectors
- resilient selector strategies
- minimal brittle CSS selectors

Preferred Playwright locators include:

```ts
page.getByRole('button', { name: 'Login' })

page.getByTestId('shopping-cart-link')
```

CSS selectors are used only when semantic locators are unavailable.

XPath selectors are intentionally avoided whenever possible to reduce brittleness and improve long-term maintainability.

---

## Framework Improvements

Recent framework improvements include:

- centralized locator abstraction layer
- reusable locator architecture
- reduced brittle CSS selectors
- cleaner separation between locators and page actions
- improved selector consistency
- improved Page Object maintainability
- accessibility-focused locator strategy
- cleaner TypeScript structure
- more stable end-to-end flows

---

## Best Practices Applied

- Page Object Model (POM)
- Dedicated locator abstraction files
- Reusable methods
- Centralized selectors
- Accessibility-first automation approach
- Semantic Playwright locators
- Async/Await implementation
- Minimal flaky selectors
- Shared setup with beforeEach
- Cross-browser configuration
- Failure screenshots/traces/videos
- Clean TypeScript typing
- Separation of concerns
- Reduced selector maintenance overhead

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

---

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
- implement locator optimization strategies
- create scalable locator abstraction systems
- improve accessibility-aware automation

---

## Repository Purpose

This repository functions as:

- a learning platform
- an automation playground
- a professional QA portfolio project

showcasing my growth in modern Front-End Quality Engineering and automation architecture.

---

## Author

Odin Jacques

GitHub: https://github.com/OdinJacques
