# Agent operations

## Local Qdrant

```bash
docker compose -f docker/docker-compose.qdrant.yml up -d
```

Set `QDRANT_URL=http://127.0.0.1:6333` and `QDRANT_API_KEY` to match compose env.

## Initial ingest

```bash
npm run ingest:knowledge
```

Requires `OPENAI_API_KEY` and reachable Qdrant.

## Reindex after content changes

1. **GitHub Actions:** Settings → Secrets → `OPENAI_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`. Run workflow **Reindex agent knowledge** manually.
2. **Admin API:** `POST /api/admin/reindex` with header `Authorization: Bearer $CRON_SECRET` (dispatches workflow when `GITHUB_REINDEX_DISPATCH=true`).
3. **Local:** `npm run ingest:knowledge`

## Private notes

Place markdown under `knowledge/private/` (gitignored). Frontmatter:

```yaml
---
visibility: public
do_not_expose: false
---
```

Never ingest `visibility: private` or `do_not_expose: true`.

## Razorpay webhook

Point webhook to `https://your-domain/api/billing/webhook` for event `payment.captured`. Payment notes must include `visitor_id` (set on order creation).

## Vercel env

Redis and Qdrant must be reachable from Vercel (HTTPS + auth for Qdrant).

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Chat, embeddings, Realtime voice |
| `QDRANT_URL`, `QDRANT_API_KEY` | RAG vector search |
| `GITHUB_TOKEN` | Live GitHub tools + richer ingest (public repo read) |
| `GITHUB_USERNAME` | Defaults to `swamiabhishek45` |
| `KNOWLEDGE_COLLECTION` | Optional; default `abhishek_knowledge_v1` |

## Recruiter knowledge checklist

Update these when your story changes, then **reindex**:

1. **[src/data/career.ts](../src/data/career.ts)** — education, jobs, achievements, current focus, FAQ
2. **[knowledge/public/](../knowledge/public/)** — long-form persona and project narrative (committed)
3. **Project markdown** — `src/data/content/projects/*.md`
4. **Resume PDF:** default `knowledge/public/Abhishek-Swami-Resume.pdf` (override with `RESUME_PDF_PATH`)
5. **Optional:** `knowledge/private/` (gitignored), LinkedIn/X JSON (`LINKEDIN_EXPORT_PATH`, `X_EXPORT_PATH`)

```bash
npm run ingest:knowledge
```

Without Qdrant, the agent still answers via **local fallback** (`buildLocalPortfolioContext`) and tools like `get_career` — but semantic search is weaker until ingest succeeds.

## Local → production Qdrant

1. Run Qdrant locally for development (see above).
2. Create a **Qdrant Cloud** (or other HTTPS) cluster for production.
3. Set the same env vars on Vercel; run `npm run ingest:knowledge` **against production** `QDRANT_URL` from your machine or CI (**Reindex agent knowledge** workflow needs `GITHUB_TOKEN` in secrets for full GitHub chunks).

## Public knowledge markdown

Committed notes live under `knowledge/public/` with frontmatter:

```yaml
---
visibility: public
do_not_expose: false
---
```
