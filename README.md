# Artopath

Explore art, film and architecture as a connected graph — works, the people who made them, the places they depict, and the lineage between them.

**Live:** https://doriru89.github.io/artopath/

This repository holds only the static frontend served by GitHub Pages. It talks to a Django + Postgres (pgvector) API on Google Cloud Run; the backend lives in a separate private repository. No secrets are stored here — API keys live server-side.

Published from the private repo with `scripts/publish_frontend.sh`; don't edit files here directly.
