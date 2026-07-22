# Frontend Foundations

A modern Front-End Automation Testing framework built with Playwright, TypeScript, and scalable automation architecture principles.

This project represents my growing expertise in Front-End Quality Engineering, UI automation, and API testing, focusing on:

- scalable Playwright architecture
- maintainable automation patterns
- accessibility-first selectors
- reliable end-to-end testing
- clean TypeScript implementation
- reusable Page Object Models
- centralized locator management
- REST API test automation
- modern QE best practices

---

## Goals of This Project

The main purpose of this repository is to demonstrate my practical knowledge in:

- Front-End Automation
- UI Functional Testing
- End-to-End Testing
- REST API Testing
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

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| TypeScript           | Main programming language       |
| Playwright           | End-to-End and API automation   |
| Node.js              | Runtime environment             |
| Dotenvx              | Environment variable management |
| Page Object Model    | Framework architecture          |
| Centralized Locators | Shared selector architecture    |
| HTML Reports         | Test reporting                  |

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
- Sorting validation (A-Z, Z-A, low-to-high, high-to-low price)
- Cart synchronization validation
- Accessibility-oriented locator validation

### Product Details Testing

- Product information validation
- Add/remove cart actions
- Cart synchronization
- Navigation flows
- Product image validation

### Cart Testing

- Empty cart validation
- Item persistence after navigation
- Item names and prices verification
- Continue shopping functionality
- Proceed to checkout navigation

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

### API Testing (GoRest API)

- User CRUD operations (Create, Read, Update, Patch, Delete)
- User validation (invalid email, gender, status)
- Post creation and retrieval
- Comment management on posts
- ToDo task creation and status management
- Sequential test execution for dependent flows

---

## Framework Architecture

```text
Frontend-Foundations
│
├── locators/
│   ├── basePage.locators.ts
│   ├── loginPage.locators.ts
│   ├── inventoryPage.locators.ts
│   ├── cartPage.locators.ts
│   ├── checkoutPage.locators.ts
│   └── productDetailPage.locators.ts
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
│   ├── myCart.spec.ts
│   ├── checkout.spec.ts
│   ├── about.spec.ts
│   └── API/
│       ├── user.spec.ts
│       ├── posts.spec.ts
│       ├── comments.spec.ts
│       └── toDos.spec.ts
│
├── Interface/
│   ├── user.ts
│   ├── post.ts
│   ├── comments.ts
│   └── toDos.ts
│
├── types/
│   ├── index.ts
│   └── ui.ts
│
├── .env
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

## Locator Architecture

The framework uses dedicated `.locators.ts` files to centralize selectors and standardize locator usage across Page Objects.

This architecture helps:

- reduce selector duplication
- keep selectors consistent across Pages
- simplify Page Object logic
- improve scalability
- make selector updates easier
- standardize locator strategy
- separate selectors from page actions

Example:

```ts
export const loginPageLocators = {
  usernameInput: '[data-test="username"]',
  passwordInput: '[data-test="password"]',
  loginButton: '[data-test="login-button"]',
  errorMessage: '[data-test="error"]',
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

- `data-test` attribute selectors
- semantic Playwright locators
- accessibility-aware selectors
- resilient selector strategies
- minimal brittle CSS selectors

Example locators:

```ts
page.getByRole('button', { name: 'Login' });

page.getByTestId('shopping-cart-link');

page.locator('[data-test="inventory-item-name"]');
```

XPath selectors are intentionally avoided to reduce brittleness and improve long-term maintainability.

---

## API Testing

The framework includes a dedicated REST API test suite targeting the [GoRest public API](https://gorest.co.in/).

### API Test Coverage

| Suite    | File                         | Description                 |
| -------- | ---------------------------- | --------------------------- |
| Users    | `tests/API/user.spec.ts`     | Full CRUD + validation      |
| Posts    | `tests/API/posts.spec.ts`    | Post creation and retrieval |
| Comments | `tests/API/comments.spec.ts` | Comment management on posts |
| ToDos    | `tests/API/toDos.spec.ts`    | Task creation and status    |

### TypeScript Interfaces

API response models are typed using dedicated interfaces under `Interface/`:

```ts
// Interface/user.ts
export interface User {
  id?: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}
```

### Environment Configuration

API tests require a `.env` file in the project root:

```env
baseURL = "https://gorest.co.in/"
token = YOUR_GOREST_API_TOKEN
```

Get a free token at [gorest.co.in](https://gorest.co.in/).

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
- TypeScript interfaces for API models
- Environment variable management with Dotenvx
- Serial test execution for dependent API flows
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

### Run only API tests

```bash
npx playwright test tests/API/
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

## Framework Improvements

Recent framework improvements include:

- REST API test suite with full CRUD coverage
- TypeScript interfaces for API response models
- Environment variable management via Dotenvx
- Centralized locator abstraction layer
- Reusable locator architecture
- Reduced brittle CSS selectors
- Cleaner separation between locators and page actions
- Improved selector consistency
- Improved Page Object maintainability
- Accessibility-focused locator strategy
- Cleaner TypeScript structure
- More stable end-to-end flows

---

## What This Project Demonstrates

This repository showcases my ability to:

- design scalable automation frameworks
- build maintainable UI automation
- implement Playwright best practices
- write clean TypeScript automation
- create reusable Page Objects
- build REST API test suites with Playwright
- model API responses with TypeScript interfaces
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

showcasing my growth in modern Front-End Quality Engineering, automation architecture, and API testing.

---

## Author

Odin Jacques

GitHub: https://github.com/OdinJacques
