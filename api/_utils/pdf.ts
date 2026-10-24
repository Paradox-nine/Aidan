import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface SubmissionData {
  fullName: string;
  email: string;
  attendance: 'Attending' | 'Not Attending' | 'Maybe';
  guestCount: number;
  message?: string;
  submittedAt: string;
}

/**
 * Sanitizes input string for pdf-lib standard fonts (WinAnsi encoding).
 * Replaces non-printable ASCII / special unicode characters with safe equivalents.
 */
export function sanitizeText(str: string): string {
  if (!str) return '';
  return str.replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ').trim();
}

/**
 * Generates an A4 PDF document containing the visitor's invitation response.
 */
export async function generateInvitationPDF(data: SubmissionData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // A4 size in points: 595.28 x 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Color Palette
  const navyColor = rgb(0.06, 0.09, 0.16); // #0f172a
  const goldColor = rgb(0.83, 0.66, 0.26); // #d4af37
  const darkGray = rgb(0.2, 0.2, 0.2);
  const lightBg = rgb(0.97, 0.97, 0.98);
  const white = rgb(1, 1, 1);

  // Header Banner Background (Navy)
  page.drawRectangle({
    x: 0,
    y: height - 140,
    width: width,
    height: 140,
    color: navyColor,
  });

  // Gold Accent Line
  page.drawRectangle({
    x: 0,
    y: height - 146,
    width: width,
    height: 6,
    color: goldColor,
  });

  // Header Text
  page.drawText('Birthday of Zin', {
    x: 40,
    y: height - 60,
    size: 26,
    font: fontBold,
    color: goldColor,
  });

  page.drawText('Official Birthday Invitation Response', {
    x: 40,
    y: height - 90,
    size: 14,
    font: fontRegular,
    color: white,
  });

  page.drawText('Birthday Date: 9 November 2004', {
    x: 40,
    y: height - 115,
    size: 11,
    font: fontRegular,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Main Card Area
  const boxTop = height - 180;
  const boxBottom = 90;
  page.drawRectangle({
    x: 40,
    y: boxBottom,
    width: width - 80,
    height: boxTop - boxBottom,
    color: lightBg,
    borderColor: rgb(0.85, 0.85, 0.88),
    borderWidth: 1,
  });

  let currentY = boxTop - 35;

  // Section Heading
  page.drawText('Submission Details', {
    x: 65,
    y: currentY,
    size: 18,
    font: fontBold,
    color: navyColor,
  });

  currentY -= 15;

  page.drawLine({
    start: { x: 65, y: currentY },
    end: { x: width - 65, y: currentY },
    thickness: 1,
    color: goldColor,
  });

  currentY -= 30;

  // Table Fields
  const fields: { label: string; value: string }[] = [
    { label: 'Full Name:', value: sanitizeText(data.fullName) },
    { label: 'Email Address:', value: sanitizeText(data.email) },
    { label: 'Attendance Status:', value: sanitizeText(data.attendance) },
    { label: 'Additional Guests:', value: data.guestCount.toString() },
    { label: 'Submission Time:', value: sanitizeText(data.submittedAt) },
  ];

  for (const field of fields) {
    page.drawText(field.label, {
      x: 65,
      y: currentY,
      size: 11,
      font: fontBold,
      color: darkGray,
    });

    page.drawText(field.value, {
      x: 210,
      y: currentY,
      size: 11,
      font: fontRegular,
      color: navyColor,
    });

    currentY -= 26;
  }

  currentY -= 10;

  page.drawText('Personal Message:', {
    x: 65,
    y: currentY,
    size: 11,
    font: fontBold,
    color: darkGray,
  });

  currentY -= 20;

  const msg = sanitizeText(data.message || '(No personal message provided)');
  const maxWidth = width - 130;
  const fontSize = 10;
  const words = msg.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const testWidth = fontRegular.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && n > 0) {
      page.drawText(line.trim(), {
        x: 65,
        y: currentY,
        size: fontSize,
        font: fontRegular,
        color: darkGray,
      });
      line = words[n] + ' ';
      currentY -= 16;
    } else {
      line = testLine;
    }
  }

  if (line.trim().length > 0) {
    page.drawText(line.trim(), {
      x: 65,
      y: currentY,
      size: fontSize,
      font: fontRegular,
      color: darkGray,
    });
  }

  // Footer Line
  page.drawLine({
    start: { x: 40, y: 60 },
    end: { x: width - 40, y: 60 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.88),
  });

  page.drawText('Birthday of Zin - Submitted Invitation Response PDF Document', {
    x: 40,
    y: 40,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
