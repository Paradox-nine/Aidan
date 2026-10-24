import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { generateInvitationPDF, SubmissionData } from './_utils/pdf.js';

// Simple in-memory rate limiting per IP for serverless instances (basic protection)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const RECIPIENT_EMAIL = 'zinmyoenaing873@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function resetRateLimitMap() {
  rateLimitMap.clear();
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Restrict allowed HTTP methods
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Only POST requests are permitted.',
    });
  }

  // 2. Body presence check
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body.',
    });
  }

  // 3. Honeypot check for spam protection
  if (req.body.website || req.body.hp_field) {
    // Silently succeed for honeypot triggers to fool bots
    return res.status(200).json({
      success: true,
      message: 'Your submission was received successfully.',
    });
  }

  // 4. Rate limiting check
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      message: 'Too many submission attempts from this IP. Please try again later.',
    });
  }

  // 5. Input Extraction and Sanitization
  let { fullName, email, attendance, guestCount, message, consent } = req.body;

  fullName = typeof fullName === 'string' ? fullName.trim() : '';
  email = typeof email === 'string' ? email.trim() : '';
  message = typeof message === 'string' ? message.trim() : '';
  attendance = typeof attendance === 'string' ? attendance.trim() : '';

  // 6. Backend Input Validation
  if (!fullName) {
    return res.status(400).json({
      success: false,
      message: 'Full name is required.',
    });
  }

  if (fullName.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Full name exceeds maximum allowed length of 100 characters.',
    });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
    });
  }

  if (email.length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Email address exceeds maximum allowed length of 150 characters.',
    });
  }

  const validAttendances = ['Attending', 'Not Attending', 'Maybe'];
  if (!attendance || !validAttendances.includes(attendance)) {
    return res.status(400).json({
      success: false,
      message: 'Attendance status must be one of: Attending, Not Attending, or Maybe.',
    });
  }

  const parsedGuestCount = Number(guestCount);
  if (isNaN(parsedGuestCount) || parsedGuestCount < 0 || parsedGuestCount > 10 || !Number.isInteger(parsedGuestCount)) {
    return res.status(400).json({
      success: false,
      message: 'Additional guest count must be a whole number between 0 and 10.',
    });
  }

  if (message && message.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Personal message exceeds maximum allowed length of 1000 characters.',
    });
  }

  if (!consent) {
    return res.status(400).json({
      success: false,
      message: 'You must consent to submitting your information for this invitation.',
    });
  }

  // 7. Validate Server Environment Variables
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error('Server Configuration Error: GMAIL_USER or GMAIL_APP_PASSWORD is missing.');
    return res.status(500).json({
      success: false,
      message: 'Server email configuration is missing. Please contact the administrator.',
    });
  }

  try {
    // 8. Generate PDF
    const now = new Date();
    const submissionTimestamp = now.toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'UTC',
    }) + ' UTC';

    const submissionData: SubmissionData = {
      fullName,
      email,
      attendance: attendance as 'Attending' | 'Not Attending' | 'Maybe',
      guestCount: parsedGuestCount,
      message: message || undefined,
      submittedAt: submissionTimestamp,
    };

    const pdfBuffer = await generateInvitationPDF(submissionData);

    // Date string formatting for attachment name: birthday-response-YYYYMMDD-HHmmss.pdf
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestampStr = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;
    const filename = `birthday-response-${timestampStr}.pdf`;

    // 9. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    const mailOptions = {
      from: `"Birthday of Zin Website" <${gmailUser}>`,
      to: RECIPIENT_EMAIL,
      subject: 'Birthday of Zin — New Invitation Submission',
      text: `Hello Zin,\n\nA new submission has been received through your Birthday of Zin website.\n\nThe visitor's information is included in the attached PDF document.\n\nPlease open the attachment to review the submission.\n\nBest regards,\nBirthday of Zin Website`,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    };

    // 10. Send Email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Your submission was received successfully.',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error handling invitation submission:', error?.message || error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process submission or send email. Please try again later.',
    });
  }
}
