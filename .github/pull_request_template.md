# Description

Please include a summary of the change and which issue is fixed.

## Type of change

- [ ] New feature (non-breaking change which adds functionality)
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactor (code improvement/cleanup)
- [ ] Documentation update

# Maintenance Checklist

Please ensure the following are maintained and updated if necessary:

- [ ] **Data Model Revisions**: Does this PR change the database schema?
  - [ ] If yes, have you created a migration file?
  - [ ] If yes, have you updated `docs/diagrams/ERD.md`?
- [ ] **Architecture Updates**: Does this PR introduce new components or change system flow?
  - [ ] If yes, have you updated `docs/diagrams/ARCHITECTURE.md`?
- [ ] **Environment Variables**: Does this PR require new environment variables?
  - [ ] If yes, have you updated `.env.example`?
- [ ] **Testing**: Have you added or updated tests?
  - [ ] Unit tests (Vitest)
  - [ ] API tests (`api-tests.http`)
- [ ] **Linting**: Have you run the linter? (`npm run lint`)

# How Has This Been Tested?

- [ ] Manual verification
- [ ] Automated tests
