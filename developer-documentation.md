# Wearabouts – Developer Documentation

## 1. Obtaining the Source Code

The Wearabouts source code is publicly available on GitHub:

[https://github.com/ambikashas/Wearabouts](https://github.com/ambikashas/Wearabouts)

To clone the repository locally:

```
git clone https://github.com/ambikashas/Wearabouts.git
cd Wearabouts
```

## Submodules

The project currently uses a single repository that includes both the frontend (React Native app) and backend (Node.js/Express API).
No external submodules are required.

---

## 2. Directory Structure
```
.
├── coding-guidelines.md
├── node_modules
├── package-lock.json
├── package.json
├── README.md
├── reports
├── team-resources.md
└── WearaboutsExpo
    ├── _mocks_
    │   ├── themed-text.tsx
    │   └── themed-view.tsx
    ├── _tests_
    │   ├── themed-text.tsx
    │   └── themed-view.tsx
    ├── app.json
    ├── assets
    │   └── images
    ├── babel.config.js
    ├── backend
    |   ├── [TO BE ADDED]
    ├── components
    ├── constants
    │   └── theme.ts
    ├── eslint.config.js
    ├── expo-env.d.ts
    ├── global.css
    ├── hooks
    ├── metro.config.js
    ├── mock-data
    │   └── items.ts
    ├── nativewind-env.d.ts
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── scripts
    │   └── reset-project.js
    ├── tailwind.config.js
    ├── tests
    |   ├── [TO BE ADDED]
    ├── tsconfig.json
    └── types
        └── outfit.ts
```

---

## 3. Building the Software
### Prerequisites

- Node.js v18+

- npm or yarn

- Expo CLI (npm install -g expo-cli)

- Firebase or MongoDB Atlas credentials

### Setup Steps

1. Install dependencies

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Frontend:

```
cd app
npm install
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Backend:
```
cd ../backend
npm install
```

2. Set up environment variables

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copy the example file:
```
cp .env.example .env
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Update API keys and credentials as needed.

3. Start the backend
```
cd backend
npm run dev
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Runs the API server at http://localhost:4000.

4. Start the frontend
```
cd app
npx expo start
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scan the QR code using the Expo Go app.

## 4. Testing the Software
### Running Tests

Each subdirectory (app/ and backend/) has its own test suite.

#### Frontend tests (Jest):
```
cd app
npm test
```

#### Backend tests (Jest or Mocha):
```
cd backend
npm test
```

All tests must pass before submitting a pull request.

### Test Data and External Dependencies

- Test clothing items are stored in backend/tests/data/.

- Mock APIs simulate Firebase and weather endpoints to ensure tests do not depend on live data.

## 5. Adding New Tests

- Naming convention:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Test files should end with .test.js or .spec.js.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Example:
```
app/tests/ClosetScreen.test.js
backend/tests/outfits.spec.js
```

- Testing framework:

    - Frontend: Jest + React Native Testing Library

    - Backend: Jest

- Test structure:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Each test file should include:
```
describe('Feature Name', () => {
  it('should perform expected behavior', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- Location:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Place new tests under app/tests/ or backend/tests/ depending on the feature.

## 6. Building a Release

When preparing a new release:

1. Update the version number

    - Increment version in package.json (semantic versioning: MAJOR.MINOR.PATCH).

    - Example: 1.0.0 → 1.1.0.

2. Run sanity checks
```
npm run lint
npm test
```

3. Build the release

- Frontend (Expo build):
```
npx expo build:android
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The .apk file will be located in your Expo build output.

- Backend (Production build):

```
cd backend
npm run build
```

4. Verify

    - Confirm both servers start correctly.

    - Ensure all routes return valid responses.

    - Test login, upload, and outfit generation workflows manually.

5. Tag the release
```
git tag -a v1.1.0 -m "Release 1.1.0 – Outfit suggestions update"
git push origin v1.1.0
```
## 7. Contributor Workflow

1. Create a new branch
```
git checkout -b feature/new-feature
```

2. Make and commit changes
```
git commit -m "Add new feature"
```

3. Push and open a Pull Request
```
git push origin feature/new-feature
```

4. Wait for peer review and CI approval before merging into main.

All commits must follow Conventional Commit style (e.g., feat: add AI tagging).

## 8. Code Quality Standards

- Linting: ESLint + Prettier

- Code style: AirBnB style guide

- Use PascalCase for React components and camelCase for variables/functions

- Avoid inline styling in React Native; use StyleSheet.create()

- Keep functions modular and avoid duplication

## 9. Sanity Checklist Before Submission

Before submitting a pull request:

- All tests pass (npm test)
- No ESLint errors (npm run lint)
- App builds successfully (npx expo start)
- .env not committed
- Documentation updated if APIs or features changed

## Summary

These developer guidelines ensure that:

- Any contributor can set up and build the project

- All code changes are tested and reviewed

- Releases are reproducible and version-controlled

- Development remains consistent, secure, and collaborative
