# Backend

Appointment requests are stored in the Firestore `appointment_requests` collection through the backend. Cookie choices are written directly by the website to `cookie_consents` with only the choice and a server timestamp; the signed-in admin dashboard reads that collection through the existing Firebase client.

## Configuration

1. Copy `.env.example` to `.env`.
2. Set `FIREBASE_PROJECT_ID` to the Firebase project that owns Firestore.
3. For local development, provide Firebase Application Default Credentials or set `FIREBASE_SERVICE_ACCOUNT_JSON` to the service-account JSON as a single-line environment value. Keep service-account credentials out of source control.
4. Set `ADMIN_EMAILS` to a comma-separated list of Firebase Auth admin account emails. The signed-in admin email must match an entry.
5. Set `CORS_ORIGINS` to the exact frontend origin.
6. Set `REACT_APP_BACKEND_URL` in the frontend environment to this API's origin. The local development default is `http://localhost:8000`.

## Firestore cookie-consent rules

Merge [firestore.cookie-consent.rules](../firestore.cookie-consent.rules) into the existing rules in Firebase Console. It allows only the two consent choices with a server timestamp, authenticated reads, and no updates or deletes. Do not deploy this fragment as the complete ruleset.

Install backend requirements, then run `uvicorn server:app --host 0.0.0.0 --port 8000` from this directory.

After a successful save, the browser opens WhatsApp with the request prefilled. The visitor must review and send the message; the API does not send WhatsApp messages itself.
