import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest, { params }: { params: { kota: string; tahun: string; bulan: string } }) {
  const { kota = '1501', tahun, bulan } = params;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const year = tahun || currentYear.toString();
  const month = bulan || currentMonth.toString();

  if (!kota || !year || !month) {
    return NextResponse.json({ error: 'City (kota), year (tahun), and month (bulan) are required' }, { status: 400 });
  }

  try {
    const apiUrl = `https://api.myquran.com/v2/sholat/jadwal/${kota}/${year}/${month}`;

    const response = await axios.get(apiUrl);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching prayer schedule:', error);
    return NextResponse.json({ error: 'Error fetching prayer schedule' }, { status: 500 });
  }
}
