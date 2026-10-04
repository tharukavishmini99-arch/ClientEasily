# FlowSell AI

FlowSell AI is a Next.js SaaS website and dashboard for an AI sales assistant.

## Stack

- Next.js
- React
- Firebase Authentication
- Firebase Firestore
- Firebase Admin SDK
- OpenAI
- Lemon Squeezy

## Firebase

Create a Firebase project and enable:

1. Authentication → Email/Password
2. Firestore Database

Copy the Firebase Web App configuration into `.env.local` using `.env.example`.

For server-side Firebase Admin routes, set:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Never commit `.env.local`.

## Lemon Squeezy

Set the store/API/webhook variables from `.env.example`.

The checkout flow uses Firebase ID tokens from the browser and Firebase Admin on the server.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

The project is intentionally Firebase-only. The previous Supabase client/server/admin files and migration folder have been removed.

The $99 setup fee is separate from the recurring subscription and is not creator-commissionable.
