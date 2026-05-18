# Security and Privacy

Robot Dungeon is a static browser game. It does not require a backend, account, database, analytics package, or tracking service.

## Local Data

The app stores player display names, mission progress, best steps, and reward state in browser `localStorage`.

That data stays on the device unless a user manually copies exported progress from the parent drawer. Clearing site data in the browser removes it.

## Public Release Checks

Before publishing the GitHub Pages preview, the repository was checked for:

- Hardcoded personal child names
- Private key headers
- GitHub token prefixes
- OpenAI key patterns
- Slack token prefixes
- Google API key prefixes
- AWS access key prefixes
- Local machine paths

The public release keeps generic profile identifiers in source: `Builder` and `Explorer`.

## Reporting

Please open a GitHub issue for security or privacy concerns in the public preview.
