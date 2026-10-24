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

## 📧 Gmail Setup Instructions

To send emails via Gmail SMTP, you need a Google App Password.

### 1. Enable 2-Step Verification
1. Go to your [Google Account](https://myaccount.google.com/).
2. Select **Security** from the left navigation menu.
3. Under *How you sign in to Google*, enable **2-Step Verification**.

### 2. Generate a Google App Password
1. Search for **App passwords** in the Google Account search bar (or navigate to *Security > 2-Step Verification > App passwords*).
2. Enter an app name (e.g., `Birthday of Zin Website`).
3. Click **Create**.
4. Copy the generated 16-character password (e.g., `abcd efgh ijkl mnop`).

### 3. Configure Local Environment Variables
Create a `.env.local` file in the project root:

```env
GMAIL_USER=zinmyoenaing873@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

---

## 🛠️ Local Development & Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Tests
```bash
npm test
```

### 3. Start Frontend Dev Server
```bash
npm run dev
```

---

## 🌐 Vercel Deployment Instructions

1. Push your repository to **GitHub**.
2. Log in to [Vercel](https://vercel.com) and import the repository.
3. In **Project Settings > Environment Variables**, add:
   - `GMAIL_USER`: `zinmyoenaing873@gmail.com`
   - `GMAIL_APP_PASSWORD`: Your 16-character Google App Password
4. Deploy the project.
5. Vercel will build the React frontend and automatically deploy the API route at `/api/submit-invitation`.

---

## 🛡️ Security Limitations & Notes

- **SMTP Credentials**: Must remain strictly in server environment variables (`GMAIL_APP_PASSWORD`). Never expose them in client-side code.
- **Rate Limiting**: Includes basic in-memory IP rate limiting per serverless instance. For multi-region high-traffic production protection, consider integrating an external KV rate limiter (such as Upstash Redis).
- **Honeypot**: Spammers triggering the hidden form field receive a dummy success message while email sending is skipped.
