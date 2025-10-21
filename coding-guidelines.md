# TypeScript (frontend & backend)
## Guideline: 

[Airbnb JavaScript / TypeScript conventions](https://github.com/airbnb/javascript) + [eslint-config-airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript)

## Why chosen:
- Airbnb’s style guide is one of the most widely adopted JavaScript/TypeScript style guides and promotes readability and maintainability.
- Compatible with React, Node.js, and modern TypeScript usage patterns our stack requires (Next.js, Node/Express).


## Enforcement plan:
1. ESLint configured with eslint-config-airbnb-typescript and @typescript-eslint plugins.


2. Pre-commit hooks using Husky + lint-staged to run eslint --fix on staged .ts / .tsx files.


3. CI checks: GitHub Actions will run npm run lint (failing the pipeline on lint errors) for every PR.


4. Code review: PR reviewers must request changes for any violations not auto-fixed by linting.


## Suggested config & scripts (example):
```
"scripts": {
  "lint": "eslint 'src/**/*.{ts,tsx,js,jsx}'",
  "lint:fix": "eslint --fix 'src/**/*.{ts,tsx,js,jsx}'"
}
```

Add .eslintrc extending the Airbnb TypeScript config and enabling Prettier integration if desired.
---
# SQL (PostgreSQL / DB scripts)
## Guideline: 
[SQL Style Guide (Simon Holywell) — SQL Style Guide](https://www.sqlstyle.guide/)


## Why chosen:
- The guide provides clear, practical rules for naming, formatting, and capitalization that help queries stay readable and reduce merge conflicts when multiple people modify DB scripts.


- It’s database-agnostic and commonly used for Postgres projects.


## Enforcement plan:
1. Peer review required for all .sql files and migrations before merging into main/master.


2. Optional automatic formatting: include sqlfluff in the repo and add a sqlfluff fix pre-commit hook for .sql files.


3. Migrations: use a migration tool (e.g., Flyway, Knex migrations, or Prisma Migrate) to manage schema changes; require PRs to include migration files and a description of schema changes.


## Suggested commands:
```
# lint/fix SQL locally
sqlfluff lint db/migrations/*.sql
sqlfluff fix db/migrations/*.sql
```
---

# Other artifacts (brief)
- Markdown / Docs: Follow CommonMark + GitHub-flavored Markdown conventions. Keep docs clear and short. Peer review docs changes.


- Shell scripts / CI configs: Follow POSIX best practices; lint with shellcheck where appropriate.

---

# Team enforcement checklist (PR template items)
- ESLint passed locally (or lint --fix applied)


- No new lint errors in CI


- SQL changes include migration files and pass sqlfluff lint (if applicable)


- At least one approving review from a team member not the author


- Tests (if any) pass and new functionality is documented

---

# Onboarding / Quick setup 
```npm install``` to get project dependencies.


```npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-airbnb-typescript eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react husky lint-staged``` (or use the project package.json).


Enable Husky hooks: ```npx husky install``` and add pre-commit hook to run ```npx lint-staged```.


Optionally install ```sqlfluff``` (```pip install sqlfluff```) and configure ```.sqlfluff```.
