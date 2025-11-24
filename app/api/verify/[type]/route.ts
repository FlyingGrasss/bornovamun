// app/api/verify/[type]/route.ts

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import getMessage from '@/lib/getMessage';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

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
    const data = await request.json();
    const { email, code, lang = 'en', ...formData } = data;
    const sheetId = getSheetId(type);

    if (!sheetId) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    const { data: codeData, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('application_type', type)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !codeData) {
      return NextResponse.json(
        { message: getMessage(lang, 'invalid_code') },
        { status: 400 }
      );
    }

    let values: any[][] = [];

    if (type === 'delegation') {
        if (Array.isArray(formData.delegates)) {
            values = formData.delegates.map((d: any) => [
                formData.school,        // 0
                email,                  // 1 (Advisor Email)
                d.fullName,             // 2
                d.email,                // 3
                d.phoneNumber,          // 4
                d.nationalId,           // 5
                d.birthDate,            // 6
                d.gender,               // 7
                d.grade,                // 8
                d.city,                 // 9
                d.accomodation,         // 10
                d.englishLevel,         // 11
                d.committeePreferences?.[0] || '', // 12
                d.committeePreferences?.[1] || '', // 13
                d.committeePreferences?.[2] || '', // 14
                d.experience,           // 15
                d.motivationLetter,     // 16
                d.dietaryPreferences,   // 17
                d.additionalInfo        // 18
            ]);
        }
    } else {
        const base = [
            formData.fullName,
            email,
            formData.phoneNumber,
            formData.nationalId,
            formData.birthDate,
            formData.gender,
            formData.school,
            formData.city,
            formData.grade,
            formData.accomodation,
        ];

        let specifics: any[] = [];
        
        if (type === 'delegate') {
             specifics = [
                 formData.englishLevel,
                 formData.committeePreferences?.[0] || '',
                 formData.committeePreferences?.[1] || '',
                 formData.committeePreferences?.[2] || '',
                 formData.experience,
                 formData.motivationLetter
             ];
        } else if (type === 'press') {
             specifics = [
                 formData.experience,
                 formData.motivationLetter,
                 formData.camera
             ];
        } else {
             specifics = [
                 formData.experience,
                 formData.motivationLetter
             ];
        }

        const footer = [
            formData.dietaryPreferences,
            formData.additionalInfo
        ];

        values = [[...base, ...specifics, ...footer]];
    }

    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sayfa1!A:Z', 
      valueInputOption: 'RAW',
      requestBody: { values }
    });

    await supabase.from('verification_codes').delete().eq('email', email);

    return NextResponse.json(
      { message: getMessage(lang, 'verification_successful') },
      { status: 200 }
    );

  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}