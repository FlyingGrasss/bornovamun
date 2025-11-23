/*// app/api/apply/[type]/route.ts

import getMessage from '@/lib/getMessage';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { google } from 'googleapis';

interface RequestData {
  email: string;
  name: string;
  lang?: 'en' | 'tr';
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY!);
const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

// Map params.type to Env Variables for Sheet IDs
const getSheetId = (type: string) => {
    switch(type) {
        case 'delegate': return process.env.GOOGLE_SHEET_ID_DELEGATE;
        case 'press': return process.env.GOOGLE_SHEET_ID_PRESS;
        case 'pr': return process.env.GOOGLE_SHEET_ID_PR;
        case 'admin': return process.env.GOOGLE_SHEET_ID_ADMIN;
        case 'delegation': return process.env.GOOGLE_SHEET_ID_DELEGATION;
        default: return null;
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    const data: RequestData = await request.json();
    const { email, name, lang = 'en' } = data;
    const sheetId = getSheetId(type);

    if (!sheetId) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    // Check if email exists in Google Sheet
    // Note: Column index for email might vary, assuming col K (index 10) for individuals based on previous code. 
    // For delegation, usually email is col B (index 1).
    const emailColIndex = type === 'delegation' ? 1 : 10; // Adjust as needed
    
    const sheetResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A2:Z1000?key=${SERVICE_ACCOUNT_KEY.private_key}`
    );
    
    const sheetData = await sheetResponse.json();
    const values = sheetData.values || [];

    if (values.some((row: string[]) => row[emailColIndex] === email)) {
      return NextResponse.json(
        { message: getMessage(lang, 'email_exists') },
        { status: 400 }
      );
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    const { error } = await supabase
      .from('verification_codes')
      .upsert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        application_type: type
      });

    if (error) throw error;

    await sendVerificationEmail(email, name, code, lang, type);

    return NextResponse.json(
      { message: getMessage(lang, 'verification_email_sent') },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(email: string, name: string, code: string, lang: 'en' | 'tr', type: string) {
  const fromEmail = process.env.RESEND_FROM_EMAIL!;
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const emailSubject = lang === 'en' 
      ? `Verify Your BORNOVAMUN ${title} Application` 
      : `BORNOVAMUN ${title} Başvurusu Doğrulama`;

  const htmlContent = lang === 'en' 
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #hsl(42,72%,52%);">BORNOVAMUN'26 ${title} Application</h1>
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
        <h1 style="color: #hsl(42,72%,52%);">BORNOVAMUN'26 ${title} Başvurusu</h1>
        <p>Sayın ${name},</p>
        <p>Başvurunuz için teşekkürler!</p>
        <p>Doğrulama kodunuz:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
          ${code}
        </div>
        <p>Saygılarımızla,<br/>BORNOVAMUN Sekreteryası</p>
      </div>
    `;

    await resend.emails.send({
      from: `BORNOVAMUN Team <${fromEmail}>`,
      to: email,
      subject: emailSubject,
      html: htmlContent,
    });
}

*/