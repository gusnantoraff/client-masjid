import { NextResponse } from 'next/server';
import axios from 'axios';

const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export async function GET(request: Request) {
  try {
    const kota = 1501;
    const date = getTodayDate();

    const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${kota}/${date}`);
    const data = response.data;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching jadwal sholat:", error);
    return NextResponse.json(
      { error: "Error fetching jadwal sholat" },
      { status: 500 }
    );
  }
}
