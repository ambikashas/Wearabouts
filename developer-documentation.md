# Wearabouts – Developer Documentation

## Obtaining the Source Code

The Wearabouts source code is publicly available on GitHub:

[https://github.com/ambikashas/Wearabouts](https://github.com/ambikashas/Wearabouts)

To clone the repository and enter the app directory:

```bash
git clone https://github.com/ambikashas/Wearabouts.git
cd Wearabouts/WearaboutsExpo
```

---

## Repository Structure

This project uses a single repository.
The project root contains documentation, configuration files, and the `reports/` folder (for weekly reports).
The `WearaboutsExpo/` folder contains the full React Native (Expo) application.

### Root-Level Structure

```
.
├── .gitignore
├── README.md
├── USER_MANUAL.md
├── coding-guidelines.md
├── developer-documentation.md
├── package.json
├── package-lock.json
├── reports/              ← weekly reports only
└── WearaboutsExpo/       ← MAIN APP DIRECTORY
```

### WearaboutsExpo Directory Structure

```
WearaboutsExpo/
├── _mocks_
├── _tests_
├── app/                  ← main app routes & screens
├── assets/
│   └── images/
├── components/
├── constants/
├── lib/                  ← Supabase + AI tagging logic
├── mock-data/
├── types/
├── global.css
├── app.json
├── tailwind.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

**Note:**
There is no standalone `backend/` directory — backend functionality is handled through **Supabase** and **Google Vision API** directly from the app.

---

## Setting Up the Development Environment

### Prerequisites

* Node.js 18+
* npm or yarn
* Expo CLI

```bash
npm install -g expo-cli
```

* Supabase project + API keys
* Google Vision API key (for clothing tag generation)

### Installation Steps

Clone the repository and navigate to the app directory:

```bash
git clone https://github.com/ambikashas/Wearabouts.git
cd Wearabouts/WearaboutsExpo
```

Navigate into the Expo app:

```bash
cd Wearabouts/WearaboutsExpo
```

Install dependencies:

```bash
npm install
```

Create your environment file (if not already included in the repository):

```bash
cp .env.example .env
```

Fill in:

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `GOOGLE_VISION_API_KEY`

Contact the developers for more information.

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code using **Expo Go**.

---

## Testing the Application

Tests for the project live under:

```
WearaboutsExpo/_tests/
```

Run the test suite:

```bash
cd Wearabouts/WearaboutsExpo
npm test
```

**Testing Notes**

* Jest config is already set up (`jest.config.js`)
* Uses mocks under `_mocks_/`
* All tests must pass before merging into main.

---

## Adding New Tests

### Naming Convention

* `*.test.tsx`
* `*.spec.tsx`

Example:

```bash
WearaboutsExpo/_tests_/SavedOutfitsScreen.test.tsx
```

### Template

```ts
describe('Feature Name', () => {
  it('should perform expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

---

## Building a Release

### 1. Update the version

Modify the version in:

```
WearaboutsExpo/package.json
```

### 2. Run sanity checks

```bash
npm run lint
npm test
```

### 3. Build the mobile bundle

Using Expo:

```bash
npx expo export
```

Or for store-ready builds:

```bash
eas build
```

### 4. Tag the release

```bash
git tag -a v1.1.0 -m "Release 1.1.0 – Outfit suggestions update"
git push origin v1.1.0
```

---

## Contributor Workflow

Create a branch:

```bash
git checkout -b feature/your-feature
```

Commit changes:

```bash
git commit -m "feat: add new feature"
```

Push and open a PR:

```bash
git push origin feature/your-feature
```

Wait for code review and CI checks.

---

## Code Quality Standards

* ESLint + Prettier
* AirBnB style guide
* React Native components: **PascalCase**
* Variables/functions: **camelCase**
* Avoid inline styles; prefer `StyleSheet` or Tailwind classes
* Keep code modular and reusable

---

## Pre-Commit Checklist

Before submitting a PR:

* All tests pass
* Linting passes (`npm run lint`)
* Expo app launches without errors
* No `.env` or secrets committed
* Documentation updated if needed

---
---

## Continuous Integration (CI)

The Wearabouts project uses **GitHub Actions** for continuous integration.

### How CI Works
- CI is **triggered automatically** whenever a **pull request (PR)** is opened or updated.  
- Workflows can also be triggered when **issues are created or closed** (if configured).  
- Typical checks include:
  - Linting (`npm run lint`)  
  - Test suite (`npm test`)  
  - Build checks for the Expo app (optional, if configured)

### Viewing Workflow History
1. Go to the GitHub repository.  
2. Click on the **Actions** tab at the top.  
3. You will see a list of all workflow runs, including PRs and issue-triggered runs.  
4. Click on a run to view:
   - Status (passed/failed)  
   - Detailed logs for each step

### Notes
- All PRs **must pass CI checks** before merging into `main`.  
- Failed runs usually indicate either:
  - Linting issues  
  - Failing tests  
  - Build errors


## Summary

These developer guidelines ensure that:

* Any contributor can set up and build the project
* All code changes are tested and reviewed
* Releases are reproducible and version-controlled
* Development remains consistent, secure, and collaborative
