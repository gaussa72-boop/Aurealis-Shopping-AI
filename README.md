# Aurealis Shopping AI

Independent Node.js web service starter.

## Run

- `npm start`
- Health endpoint: `/health`

## Current status

The repository contains the first responsive storefront interface and a minimal HTTP server. Product cards are explicitly illustrative. No live product search, accounts, premium billing, checkout, supplier ordering, email approval workflow, or shipment tracking is active yet.

## Next integrations

1. Product discovery providers and supplier feeds.
2. Price normalization and a configurable 10% markup, with tax/shipping shown separately.
3. Database, authentication, user-owned wishlists and premium entitlements.
4. Checkout and an explicit approval step before any supplier order.
5. Supplier-specific order APIs, confirmation emails, and tracking events.

Never place API keys in frontend code. Configure secrets as Render environment variables.
