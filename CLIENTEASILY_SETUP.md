# ClientEasily production setup

## 1. Install and run
Copy `.env.example` to `.env.local`, fill the real values, then run `npm install`, `npm run build`, and `npm run dev`.

## 2. Firebase
Create/confirm Firebase Auth and Firestore, add the client + Admin SDK environment values, deploy `firestore.rules`, and use HTTPS in production.

## 3. Lemon Squeezy
Configure Store ID, API key, webhook secret, and the three variant IDs for $99 setup, $79 Starter and $129 Pro. Optimize uses the contact-sales flow and has no fixed checkout variant. Configure the webhook URL to `/api/webhooks/lemonsqueezy` on the production domain.

## 4. Meta / channels
Create the appropriate Meta developer/business apps and connect only permissions your product actually uses. Fill the Meta/WhatsApp environment values after approval. Configure callback/webhook URLs on the final HTTPS domain. Keep opt-in, opt-out, human handover and provider policy requirements in the operating workflow. Telegram requires its own bot token. Provider approval cannot be guaranteed by code alone.

## 5. Pricing and fees
Public pricing is $99 one-time setup, Starter $79/month, Pro $129/month, and Optimize by quote. Starter/Pro are subject to Fair Usage. Meta and other third-party messaging/API/platform fees are separate where applicable.

## 6. Legal launch checklist
The included legal pages are implementation templates, not jurisdiction-specific legal advice. Before launch replace placeholder business/support details and have the terms, privacy, refund/cancellation, fair-usage, creator and data-deletion wording reviewed for the jurisdictions where ClientEasily operates.

## 7. Security
Never commit `.env.local`, private keys, API secrets, webhook secrets or access tokens. Use production secret management and least-privilege provider permissions.
