# AUREALIS SHOPPING AI

Aurealis-branded marketplace starter, deployed as the existing independent Render service.

## Included in this release
- Responsive marketplace storefront with search, category filters, sorting, product cards and cart drawer.
- Demo product catalog served by `GET /api/products`.
- Credit preview rule: standard accounts accrue 3% of the cart merchandise subtotal; Premium accounts accrue 0%.
- Health endpoint: `/health`.

## Important integration status
The current catalog is illustrative demo data. Search, cart and credits are a front-end preview; there is not yet a persistent customer database, real account authentication, Premium entitlement verification, credit ledger, supplier feed, payment provider, order management, shipping or returns integration. The checkout intentionally does not place orders or collect payments. Do not treat the displayed demo credits as redeemable balances.

## Next production integrations
1. Secure authentication and server-verified Premium entitlements.
2. Database-backed products, carts, orders and immutable credit ledger.
3. Supplier/catalog APIs and verified images, prices, inventory and shipping.
4. Payment provider, tax/shipping calculation, order confirmation and fulfillment APIs.
5. Admin and seller tools with permissions and audit trail.

Never put API keys in frontend code. Configure secrets as Render environment variables. The marketplace uses its own branding and does not use Amazon's logo or proprietary assets.

## Aurealis Finance integration
- The storefront navigation links to the authenticated ULTIMA account finance center at `https://ultima-membership-api.onrender.com/portal#finance-center`.
- Invoice records, additional collection/reminder costs, payment status and personal financing plans are stored per authenticated ULTIMA account in the central membership database.
- The superadmin view at `/admin/finance` exposes aggregate counts only; individual mailbox contents and invoice details remain private to each account.
- Mail-provider integration is not yet live. Gmail, Outlook, iCloud Mail and Hostinger Mail require provider-specific OAuth client configuration, callback validation, encrypted refresh-token storage, least-privilege scopes and an end-to-end security test before messages or attachments can be imported. Never ask users for mailbox passwords or place OAuth secrets in frontend code.
- Until OAuth is enabled, users can add invoices manually and manage paid status, collection/reminder fees and a personal repayment budget in the finance center.
