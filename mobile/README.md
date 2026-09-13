# School Management — Mobile App (Phase 4)

A React Native (Expo) app that reuses the same backend API as the web app.
Scoped to what parents/students and teachers need on the go:

- **Students:** view their own attendance history, report card (with term average), and fee balance/payment history
- **Teachers:** see the classes they're assigned to and mark today's attendance from their phone

Admins should keep using the web app — this mobile app intentionally doesn't
include class/student/fee-structure management.

## Before you run it

### 1. Find your computer's local IP address
Your phone can't reach your computer via `localhost` — it needs your computer's
IP address on the same Wi-Fi network.

On Windows, open Command Prompt and run:
```
ipconfig
```
Look for "IPv4 Address" (something like `192.168.1.42`).

### 2. Update the API URL
Open `src/api/client.js` and change this line to your actual IP:
```js
const API_BASE_URL = "http://192.168.1.42:5000/api";
```

### 3. Make sure your backend allows connections from your phone
Your backend (`npm run dev` in the `backend` folder) needs to already be running
and reachable — it listens on all interfaces by default, so this should just work
as long as your phone and computer are on the same Wi-Fi network.

## Running the app

```
cd mobile
npm install
npx expo start
```

This prints a QR code in your terminal.

- **On your phone:** install the "Expo Go" app (Play Store / App Store), then
  scan the QR code. Your phone and computer must be on the same Wi-Fi network.
- **On an emulator:** press `a` for Android emulator or `i` for iOS simulator
  (requires Android Studio / Xcode already set up).

## Linking a student to a mobile login

Right now, a student's own login only shows their data if their student
record is linked to a user account. To link one:

1. Register a **student**-role account for them at `http://localhost:5173/register`
   (or have them do it) — this is their mobile login.
2. As an admin, call this endpoint (e.g. with Postman, or `curl`) to link it:
   ```
   POST http://localhost:5000/api/students/<studentId>/link-account
   Authorization: Bearer <admin JWT>
   Content-Type: application/json

   { "email": "the-student-account-email@example.com" }
   ```
3. That student can now log in on mobile and see their own attendance, grades,
   and fees.

Teachers don't need this step — as long as their user account is set as the
`classTeacher` on a class (via the web app's Classes page), their taught
classes show up automatically.

## What's next
- Phase 5: multi-school support, admin reporting dashboard, public landing page
- A natural follow-up here: a small in-app screen for admins to set the API URL
  and link student accounts, instead of doing it via `curl`/Postman
