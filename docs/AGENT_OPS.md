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

Copy variables from `.env.example`. Redis and Qdrant must be reachable from Vercel (HTTPS + auth for Qdrant).
