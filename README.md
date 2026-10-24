# Birthday of Zin — Birthday Invitation Website

A modern, responsive birthday invitation application built with React, TypeScript, Tailwind CSS, Vite, and Vercel Functions.

When visitors complete the invitation response form, the server generates a styled PDF summary and emails it directly to **zinmyoenaing873@gmail.com** using Nodemailer and Gmail SMTP.

---

## 🌟 Key Features

- **No Database Required**: Invitation responses are converted into PDF documents on the server and emailed instantly.
- **Server-Side PDF Generation**: Built with `pdf-lib` to render A4 PDF summaries with server timestamping and custom formatting.
- **Gmail SMTP Integration**: Powered by Nodemailer for reliable email delivery with attached PDFs.
- **Serverless API Endpoint**: Vercel-compatible function (`POST /api/submit-invitation`).
- **Comprehensive Validation & Security**:
  - Double-sided validation (React frontend + serverless backend).
  - Rate limiting per IP to protect against spam.
  - Honeypot field to trap automated bots.
  - Strict input size limits and method checks.
- **Elegant UI**: Dark navy and gold accent theme with mobile-first responsive layout.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend / API**: Vercel Serverless Functions (`@vercel/node`)
- **PDF Generation**: `pdf-lib`
- **Email Delivery**: `nodemailer`
- **Testing**: `vitest`

---

## 📧 Fixing "Server email configuration is missing" Error & Gmail Setup

If you see the error message **"Server email configuration is missing. Please contact the administrator"**, it means Vercel does not have the required environment variables set.

Follow these steps to configure your Gmail App Password in Vercel:

### 1. Enable Google 2-Step Verification
1. Go to your [Google Account Settings](https://myaccount.google.com/).
2. Select **Security** from the left-hand menu.
3. Under *How you sign in to Google*, enable **2-Step Verification**.

### 2. Generate a Google App Password
1. In the Google Account search bar at the top, search for **App passwords** (or go to *Security > 2-Step Verification > App passwords*).
2. Enter an app name (e.g., `Birthday of Zin Website`).
3. Click **Create**.
4. Copy the generated **16-character password** (e.g., `abcd efgh ijkl mnop`).

### 3. Add Environment Variables to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your `birthday-of-zin` project.
3. Navigate to **Settings > Environment Variables**.
4. Add the following variables:
   - **Key**: `GMAIL_USER`
     - **Value**: `zinmyoenaing873@gmail.com`
   - **Key**: `GMAIL_APP_PASSWORD`
     - **Value**: `your_16_character_app_password` (without spaces)
5. Select all environments (**Production**, **Preview**, **Development**) and click **Save**.

### 4. ⚠️ CRITICAL STEP: Redeploy Your Vercel Application
**Important**: In Vercel, serverless function environment variables take effect **ONLY AFTER A NEW DEPLOYMENT**. Adding variables does not retroactively update an active deployment.

To trigger a redeployment:
1. In Vercel, go to the **Deployments** tab.
2. Click the three dots `...` next to your latest deployment and select **Redeploy**.
3. Alternatively, push a new commit to your GitHub repository to trigger an automatic rebuild.

---

## 🛠️ Local Development & Testing

### 1. Configure Local Environment Variables
Create a `.env.local` file in the project root:

```env
GMAIL_USER=zinmyoenaing873@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start Frontend Dev Server
```bash
npm run dev
```

---

## 🛡️ Security Limitations & Notes

- **SMTP Credentials**: Must remain strictly in server environment variables (`GMAIL_APP_PASSWORD`). Never expose them in client-side code.
- **Rate Limiting**: Includes basic in-memory IP rate limiting per serverless instance.
- **Honeypot**: Spammers triggering the hidden form field receive a dummy success message while email sending is skipped.
