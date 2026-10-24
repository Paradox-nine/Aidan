import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler, { resetRateLimitMap } from '../api/submit-invitation';
import { generateInvitationPDF, sanitizeText } from '../api/_utils/pdf';
import nodemailer from 'nodemailer';

const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'test-message-id' });

// Mock nodemailer
vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: mockSendMail,
      })),
    },
  };
});

function createMockReqRes(method: string, body: any = {}) {
  const req: any = {
    method,
    body,
    headers: {},
    socket: { remoteAddress: '127.0.0.1' },
  };

  let statusCode = 200;
  let responseData: any = null;
  const headers: Record<string, string> = {};

  const res: any = {
    status: vi.fn((code: number) => {
      statusCode = code;
      return res;
    }),
    json: vi.fn((data: any) => {
      responseData = data;
      return res;
    }),
    setHeader: vi.fn((key: string, val: string) => {
      headers[key] = val;
      return res;
    }),
    getStatusCode: () => statusCode,
    getResponseData: () => responseData,
  };

  return { req, res };
}

describe('PDF Generation Helper', () => {
  it('sanitizes text properly', () => {
    expect(sanitizeText('Hello World!')).toBe('Hello World!');
    expect(sanitizeText('Special \uD83C\uDF89 characters')).toBe('Special    characters');
  });

  it('generates a valid PDF buffer', async () => {
    const pdfBytes = await generateInvitationPDF({
      fullName: 'John Doe',
      email: 'john@example.com',
      attendance: 'Attending',
      guestCount: 1,
      message: 'Happy Birthday Zin!',
      submittedAt: 'Monday, November 9, 2024 at 12:00:00 PM UTC',
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(500);

    // Verify PDF Magic Bytes %PDF
    const header = String.fromCharCode(...pdfBytes.slice(0, 4));
    expect(header).toBe('%PDF');
  });
});

describe('API Endpoint: POST /api/submit-invitation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks();
    resetRateLimitMap();
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });
    process.env = {
      ...originalEnv,
      GMAIL_USER: 'zinmyoenaing873@gmail.com',
      GMAIL_APP_PASSWORD: 'test-app-password',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('rejects non-POST HTTP methods', async () => {
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.getResponseData().success).toBe(false);
  });

  it('rejects submissions with missing full name', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: '',
      email: 'visitor@example.com',
      attendance: 'Attending',
      guestCount: 0,
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.getResponseData().message).toMatch(/Full name is required/i);
  });

  it('rejects submissions with invalid email address', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: 'Jane Doe',
      email: 'invalid-email',
      attendance: 'Attending',
      guestCount: 0,
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.getResponseData().message).toMatch(/valid email address/i);
  });

  it('rejects submissions with invalid attendance value', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      attendance: 'InvalidOption',
      guestCount: 0,
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.getResponseData().message).toMatch(/Attendance status must be/i);
  });

  it('rejects invalid guest count', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      attendance: 'Attending',
      guestCount: 15, // Max limit is 10
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.getResponseData().message).toMatch(/guest count must be/i);
  });

  it('rejects submissions without consent', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      attendance: 'Attending',
      guestCount: 0,
      consent: false,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.getResponseData().message).toMatch(/must consent/i);
  });

  it('silently absorbs bot honeypot submissions', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: 'Spam Bot',
      email: 'bot@example.com',
      attendance: 'Attending',
      website: 'http://spam.com', // Honeypot field
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.getResponseData().success).toBe(true);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('returns 500 error when GMAIL_APP_PASSWORD env var is missing', async () => {
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    delete process.env.GMAIL_PASSWORD;
    delete process.env.GMAIL_PASS;

    const { req, res } = createMockReqRes('POST', {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      attendance: 'Attending',
      guestCount: 0,
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.getResponseData().message).toMatch(/Server email configuration is missing/i);
  });

  it('supports GMAIL_PASSWORD alias when GMAIL_APP_PASSWORD is not set', async () => {
    delete process.env.GMAIL_APP_PASSWORD;
    process.env.GMAIL_PASSWORD = 'alias-app-password';

    const { req, res } = createMockReqRes('POST', {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      attendance: 'Attending',
      guestCount: 0,
      consent: true,
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'zinmyoenaing873@gmail.com',
        pass: 'alias-app-password',
      },
    });
  });

  it('successfully generates PDF and sends email on valid payload', async () => {
    const { req, res } = createMockReqRes('POST', {
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      attendance: 'Attending',
      guestCount: 2,
      message: 'Looking forward to celebrating!',
      consent: true,
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.getResponseData().success).toBe(true);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'zinmyoenaing873@gmail.com',
        pass: 'test-app-password',
      },
    });
    expect(mockSendMail).toHaveBeenCalled();
  });
});
