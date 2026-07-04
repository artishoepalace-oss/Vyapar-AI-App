# Vyapar AI Final Developer Setup

## What is ready in this ZIP

- Clean customer-facing app UI
- Sales add/edit/delete
- Monthly profit add/edit/delete
- HD profit graph with average line
- Stock manager
- Light/Dark mode
- Liquid glass on/off + opacity control
- Low-end device Lite mode
- Adjustable code calculator
- Local auto-save using browser/WebView storage
- JSON backup export/restore
- Hidden Developer Mode
- Firebase/Node backend template for AI extraction

## Hidden Developer Mode

Open the app and tap the logo 7 times.

Developer Mode includes:

- AI Extract Endpoint
- Backend test button
- Billing mode selector
- Developer-only notes

Normal users will not see backend/API words.

## AI endpoint format

Set Developer Mode endpoint to:

```text
https://your-domain.com/extractBill
```

The app will send uploaded photo/PDF files to this endpoint.

Backend must return:

```json
{
  "sales": [
    {
      "date": "2026-06-16",
      "product": "School Shoes",
      "category": "Footwear",
      "purchasePrice": 300,
      "sellingPrice": 499,
      "quantity": 2
    }
  ],
  "monthlyProfits": [
    {
      "month": "2026-06",
      "profit": 12000
    }
  ],
  "stocks": [
    {
      "item": "Kids Shoes",
      "qty": 12,
      "min": 5
    }
  ]
}
```

## Backend deployment

Backend template is in:

```text
backend-firebase-functions/
```

Steps:

```bash
cd backend-firebase-functions
npm install
cp .env.example .env
# Add your server-side AI key in .env
npm run serve
```

For deployment, connect this folder to Firebase Functions / Cloud Run / any Node hosting.

## Data safety

Current app saves data locally and supports JSON export/restore.

Recommended production upgrade:

- Add Firebase Auth
- Add Firestore sync per user/business ID
- Keep local cache enabled
- Keep export/restore for emergency backup

## Billing

This ZIP includes UI and backend verification placeholder.

Production billing still needs:

- Google Play Billing integration inside native Android layer for Play Store subscriptions
- Server-side purchase token verification
- Firestore/user plan update after verification
- Razorpay can be used for website/manual flow or eligible alternative billing flows, but do not place Razorpay secret keys inside the app

## Important

Do not put OpenAI/Gemini/Razorpay secret keys inside Android assets or WebView HTML.
Keep secrets only on backend.
