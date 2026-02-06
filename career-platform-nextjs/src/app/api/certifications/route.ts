import { NextRequest, NextResponse } from 'next/server';
import type { Certification } from '@/types/api';

export async function GET() {
  try {
    console.log('Fetching certifications from Supabase...');
    
    // Express APIを呼び出す（Supabase対応済み）
    const expressApiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';
    
    // タイムアウトを設定（30秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(`${expressApiUrl}/api/certifications`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch certifications from Express API:', response.status, response.statusText, errorText);
        throw new Error(`Failed to fetch certifications: ${response.status} ${response.statusText}`);
      }
      
      const certifications = await response.json();
      console.log('Certifications fetched successfully:', Array.isArray(certifications) ? certifications.length : 'not an array');
      
      // レスポンスが配列でない場合のエラーハンドリング
      if (!Array.isArray(certifications)) {
        console.error('Invalid response format:', certifications);
        return NextResponse.json(
          { 
            error: 'Invalid response format',
            details: 'Expected array but got ' + typeof certifications
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(certifications);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout while fetching certifications');
        throw new Error('Request timeout: Express API did not respond within 30 seconds');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch certifications',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating certification via Express API...');
    
    // FormDataをそのままExpress APIに転送
    const formData = await request.formData();
    
    // Express APIを呼び出す（Supabase対応済み）
    const expressApiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL || 'http://localhost:4000';
    
    const response = await fetch(`${expressApiUrl}/api/certifications`, {
      method: 'POST',
      body: formData,
      // Content-TypeヘッダーはFormDataに設定するとboundaryが自動で設定されるため、明示的に設定しない
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create certification via Express API:', response.status, response.statusText, errorText);
      return NextResponse.json(
        { 
          error: 'Failed to create certification',
          details: errorText || response.statusText
        },
        { status: response.status }
      );
    }
    
    const createdCertification = await response.json();
    console.log('Certification created successfully:', createdCertification.id);
    
    return NextResponse.json(createdCertification, { status: 201 });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create certification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
