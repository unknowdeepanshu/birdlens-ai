# Contributing to BirdLens AI

Use Node.js 22.12+ or 24 LTS. Follow the README setup and run `npm test`, `npm run build`, and browser tests before submitting a change.

Keep contributions focused. Open an issue describing a bug or proposed change, then submit a pull request explaining the solution and tests. Include desktop/mobile screenshots for interface changes and a reproducible photo source for inference bugs; don't upload private photographs without permission.

Useful first contributions:
- Add carefully sourced field-guide entries with scientific names and references.
- Test local inference and offline operation on different phones and browsers.
- Improve accessible loading/error states and keyboard navigation.
- Evaluate the pinned model on a licensed, independent field-photo dataset.

Never add canned predictions, invented scores, unsourced bird facts, tracking, secrets, or silent remote photo uploads. Keep inference separate from UI. Model changes require checking licenses, label ordering, preprocessing, numerical output, download size, and measured performance; do not treat a model-card metric as field accuracy.

Be considerate and constructive. Respect wildlife, privacy, and other contributors. Contributions are provided under this project's MIT license; referenced data retains its own license.
