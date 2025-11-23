# Wearabouts – Developer Documentation 

## Obtaining the Source Code

The Wearabouts source code is publicly available on GitHub:

[https://github.com/ambikashas/Wearabouts](https://github.com/ambikashas/Wearabouts)

To clone the repository and enter the app directory:

```bash
git clone https://github.com/ambikashas/Wearabouts.git
cd Wearabouts/WearaboutsExpo

```bash

```bash
## Repository Structure
This project uses a single repository.
The project root contains documentation, configuration files, and the reports/ folder (for weekly reports).
The WearaboutsExpo/ folder contains the full React Native (Expo) application.

Root-Level Structure
pgsql
Copy code
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
WearaboutsExpo Directory Structure
pgsql
Copy code
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
Note:
There is no standalone backend/ directory — backend functionality is handled through Supabase and Google Vision API directly from the app.

## Setting Up the Development Environment
Prerequisites
Node.js 18+

npm or yarn

Expo CLI

bash
Copy code
npm install -g expo-cli
Supabase project + API keys

Google Vision API key (for clothing tag generation)

Installation Steps
Navigate into the Expo app:

bash
Copy code
cd Wearabouts/WearaboutsExpo
Install dependencies:

bash
Copy code
npm install
Create your environment file:

bash
Copy code
cp .env.example .env
Fill in:

SUPABASE_URL

SUPABASE_ANON_KEY

GOOGLE_VISION_API_KEY

Start the Expo development server:

bash
Copy code
npx expo start
Scan the QR code using Expo Go.

## Testing the Application
Tests for the project live under:

bash
Copy code
WearaboutsExpo/_tests/
Run the test suite:

bash
Copy code
cd Wearabouts/WearaboutsExpo
npm test
Testing Notes

Jest config is already set up (jest.config.js)

Uses mocks under _mocks_/

All tests must pass before merging into main.

## Adding New Tests
Naming Convention
*.test.tsx

*.spec.tsx

Example:

bash
Copy code
WearaboutsExpo/_tests_/SavedOutfitsScreen.test.tsx
Template
ts
Copy code
describe('Feature Name', () => {
  it('should perform expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
## Building a Release
1. Update the version
Modify the version in:

bash
Copy code
WearaboutsExpo/package.json
2. Run sanity checks
bash
Copy code
npm run lint
npm test
3. Build the mobile bundle
Using Expo:

bash
Copy code
npx expo export
Or for store-ready builds:

bash
Copy code
eas build
4. Tag the release
bash
Copy code
git tag -a v1.1.0 -m "Release 1.1.0 – Outfit suggestions update"
git push origin v1.1.0
## Contributor Workflow
Create a branch:

bash
Copy code
git checkout -b feature/your-feature
Commit changes:

bash
Copy code
git commit -m "feat: add new feature"
Push and open a PR:

bash
Copy code
git push origin feature/your-feature
Wait for code review and CI checks

## Code Quality Standards
ESLint + Prettier

AirBnB style guide

React Native components: PascalCase

Variables/functions: camelCase

Avoid inline styles; prefer StyleSheet or Tailwind classes

Keep code modular and reusable

## Pre-Commit Checklist
Before submitting a PR:

All tests pass

Linting passes (npm run lint)

Expo app launches without errors

No .env or secrets committed

Documentation updated if needed

## Summary

These developer guidelines ensure that:

- Any contributor can set up and build the project

- All code changes are tested and reviewed

- Releases are reproducible and version-controlled

- Development remains consistent, secure, and collaborative
