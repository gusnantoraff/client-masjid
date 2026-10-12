import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('https://api.myquran.com/v2/sholat/kota/semua');
    const data = response.data;

    return NextResponse.json({
      status: true,
      request: {
        path: '/sholat/kota/semua'
      },
      data: data
    });
  } catch (error) {
    console.error('Error fetching kota:', error);
    return NextResponse.json(
      { error: 'Error fetching kota' },
      { status: 500 }
    );
  }
}