// app/api/apply/[type]/route.ts

import getMessage from '@/lib/getMessage';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { google } from 'googleapis';

interface RequestData {
  email: string;
  name: string;
  lang?: 'en' | 'tr';
}

const resend = new Resend(process.env.RESEND_API_KEY!);
const SERVICE_ACCOUNT_KEY = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY!
);

const getSheetId = (type: string) => {
  switch (type) {
    case 'delegate':
      return process.env.GOOGLE_SHEET_ID_DELEGATE;
    case 'press':
      return process.env.GOOGLE_SHEET_ID_PRESS;
    case 'chair':
      return process.env.GOOGLE_SHEET_ID_CHAIR;
    case 'admin':
      return process.env.GOOGLE_SHEET_ID_ADMIN;
    case 'delegation':
      return process.env.GOOGLE_SHEET_ID_DELEGATION;
    default:
      return null;
  }
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const data: RequestData = await request.json();
    const { email, name, lang = 'en' } = data;
    const sheetId = getSheetId(type);

    // 1. IP Rate Limiting Logic
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Check last verification attempt by this IP across all application types
    const { data: recentAttempts } = await supabase
      .from('verification_codes')
      .select('created_at')
      .eq('ip', ip)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentAttempts) {
      const lastAttempt = new Date(
        recentAttempts.created_at
      ).getTime();
      const now = Date.now();
      if (now - lastAttempt < 60000) {
        // 60 seconds limit
        return NextResponse.json(
          {
            message:
              'You have sent a verification email recently. Please wait 60 seconds before trying again.'
          },
          { status: 429 }
        );
      }
    }

    if (!sheetId)
      return NextResponse.json(
        { error: 'Invalid application type.' },
        { status: 400 }
      );

    // 2. Comprehensive Email Exists Check (Across ALL columns)
    const authGoogle = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT_KEY,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly'
      ] // Use read-only scope for existence check
    });
    const sheets = google.sheets({
      version: 'v4',
      auth: authGoogle
    });

    const sheetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sayfa1!A:Z' // Check all possible columns
    });

    const values = sheetResponse.data.values || [];

    // Check if the email exists in ANY column of ANY row
    const emailExistsInSheet = values.some((row: string[]) =>
      row.some(
        (cell) => cell && cell.toLowerCase() === email.toLowerCase()
      )
    );

    if (emailExistsInSheet) {
      return NextResponse.json(
        { message: getMessage(lang, 'email_exists') },
        { status: 400 }
      );
    }

    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 3. Store with IP
    const { error } = await supabase
      .from('verification_codes')
      .upsert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        application_type: type,
        ip: ip // Saving IP here
      });

    if (error) {
      console.error('Supabase Upsert Error:', error);
      return NextResponse.json(
        { error: 'Failed to save verification data.' },
        { status: 500 }
      );
    }

    await sendVerificationEmail(
      email,
      name,
      code,
      lang,
      type
    );

    return NextResponse.json(
      {
        message: getMessage(lang, 'verification_email_sent')
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Apply Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(
  email: string,
  name: string,
  code: string,
  lang: 'en' | 'tr',
  type: string
) {
  const fromEmail = process.env.RESEND_FROM_EMAIL!;
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const emailSubject =
    lang === 'en'
      ? `Verify Your BORNOVAMUN ${title} Application`
      : `BORNOVAMUN ${title} Başvurusu Doğrulama`;

  const htmlContent =
    lang === 'en'
      ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1a030;">BORNOVAMUN'26 ${title} Application</h1>
        <p>Dear ${name},</p>
        <p>Thank you for applying!</p>
        <p>Your verification code is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          ${code}
        </div>
        <p>Best regards,<br/>BORNOVAMUN Secretariat</p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d1a030;">BORNOVAMUN'26 ${title} Başvurusu</h1>
        <p>Sayın ${name},</p>
        <p>Başvurunuz için teşekkürler!</p>
        <p>Doğrulama kodunuz:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          ${code}
        </div>
        <p>Saygılarımızla,<br/>BORNOVAMUN Sekreteryası</p>
      </div>
    `;

  const { error: resendError } = await resend.emails.send({
    from: `BORNOVAMUN Team <${fromEmail}>`,
    to: email,
    subject: emailSubject,
    html: htmlContent
  });

  if (resendError) {
    console.error('Resend Email Error:', resendError);
  }
}