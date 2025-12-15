// app/api/verify/[type]/route.ts

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import getMessage from '@/lib/getMessage';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY!
  ),
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets'
  ]
});

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
    const data = await request.json();
    const { email, code, lang = 'en', ...formData } = data;
    const sheetId = getSheetId(type);

    if (!sheetId)
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );

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
        // 1. Add the Delegation Header Row
        values.push([
          formData.school, // Column 1: School Name
          formData.numberOfDelegates, // Column 2: Delegate Count
          email // Column 3: Advisor/delegation Email
        ]);

        // 2. Add each Delegate Row
        formData.delegates.forEach((d: any) => {
          values.push([
            d.fullName, // 1: Delegate Full Name
            d.birthDate, // 2: Birth Date
            d.nationalId, // 3: TC
            d.gender, // 4: Gender
            d.committeePreferences?.[0] || '', // 5: Committee 1
            d.committeePreferences?.[1] || '', // 6: Committee 2
            d.committeePreferences?.[2] || '', // 7: Committee 3
            d.englishLevel, // 8: English Level
            d.dietaryPreferences, // 9: Diet
            d.email, // 10: Email
            d.phoneNumber, // 11: Phone Number
            d.city, // 12: City
            d.grade, // 13: Grade
            d.experience, // 14: Experience
            d.motivationLetter, // 15: Motivation Letter
            d.additionalInfo // 16: Additional Info
          ]);
        });
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
        formData.grade
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
      } else if (type === 'chair') {
        specifics = [
          formData.englishLevel || 'N/A',
          formData.committeePreferences?.[0] || '',
          formData.committeePreferences?.[1] || '',
          formData.committeePreferences?.[2] || '',
          formData.experience,
          formData.motivationLetter,
          formData.chairAnswer1 || '', // GA Question
          formData.chairAnswer3 || '', // Crisis Directive Question
          formData.chairAnswer2 || '' // Procedure Question
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

    await supabase
      .from('verification_codes')
      .delete()
      .eq('email', email);

    return NextResponse.json(
      {
        message: getMessage(lang, 'verification_successful')
      },
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