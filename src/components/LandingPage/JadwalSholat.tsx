"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface JadwalSholatData {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

const JadwalSholat = () => {
  const [jadwal, setJadwal] = useState<JadwalSholatData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const convertToDate = (time: string, isNextDay = false): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    if (isNextDay) date.setDate(date.getDate() + 1);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const calculateTimeLeft = (nextPrayerTime: Date): string => {
    const now = new Date();
    const diff = Math.abs(nextPrayerTime.getTime() - now.getTime());
    const hoursLeft = Math.floor(diff / 1000 / 60 / 60);
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hoursLeft} jam ${minutesLeft} menit`;
  };

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await axios.get('/api/jadwal-harian');
        const data = response.data?.data?.jadwal;
        if (data) {
          setJadwal(data);

          const prayerTimes = [
            { name: "Subuh", time: data.subuh },
            { name: "Dzuhur", time: data.dzuhur },
            { name: "Ashar", time: data.ashar },
            { name: "Maghrib", time: data.maghrib },
            { name: "Isya", time: data.isya },
          ];

          const now = new Date();
          let nextPrayerTime: Date | null = null;
          let nextPrayerName: string | null = null;

          for (let i = 0; i < prayerTimes.length; i++) {
            const prayerTime = convertToDate(prayerTimes[i].time);
            if (prayerTime > now) {
              nextPrayerTime = prayerTime;
              nextPrayerName = prayerTimes[i].name;
              break;
            }
          }

          if (!nextPrayerTime || !nextPrayerName) {
            nextPrayerTime = convertToDate(prayerTimes[0].time, true);
            nextPrayerName = prayerTimes[0].name;
          }

          if (nextPrayerTime && nextPrayerName) {
            setNextPrayer(nextPrayerName);
            setTimeLeft(calculateTimeLeft(nextPrayerTime));
          }
        } else {
          throw new Error("Jadwal untuk tanggal hari ini tidak ditemukan.");
        }
      } catch (error: any) {
        console.error("Error fetching jadwal sholat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJadwal();
  }, []);

  return (
    <div
  className="bg-white shadow-md rounded-lg p-6 w-full max-w-[1100px] mx-auto sm:mt-4 sm:mb-6"
  style={{
    backgroundImage: "url('/images/BG.png')",
    backgroundSize: "cover",
  }}
>
  <div className="mt-6 text-white font-semibold font-poppins">
    <p className="text-lg sm:text-xl md:text-2xl">
      Jadwal shalat berikutnya <strong className="text-xl sm:text-2xl">{nextPrayer}</strong>
    </p>
    <p className="text-lg sm:text-xl md:text-2xl">
      Akan dimulai dalam <strong className="text-xl sm:text-2xl">{timeLeft}</strong> lagi
    </p>
  </div>
  <hr className="my-6 border-white w-[88%] mx-auto" />

  {isLoading ? (
    <p className="text-center text-white font-semibold text-lg sm:text-xl md:text-2xl font-poppins">Loading...</p>
  ) : (
    jadwal && (
      <>
        {/* Jadwal dalam satu baris */}
        <div className="w-full flex flex-wrap justify-center gap-4 text-white font-semibold font-poppins text-sm sm:text-base md:text-lg lg:text-xl">
          <div className="flex flex-col items-center">
            <p className="mb-2">Subuh</p>
            <p className="font-light">{jadwal.subuh} WIB</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2">Dzuhur</p>
            <p  className="font-light">{jadwal.dzuhur} WIB</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2">Ashar</p>
            <p  className="font-light">{jadwal.ashar} WIB</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2">Maghrib</p>
            <p  className="font-light">{jadwal.maghrib} WIB</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-2">Isya</p>
            <p  className="font-light">{jadwal.isya} WIB</p>
          </div>
        </div>
      </>
    )
  )}
</div>

  );
};

export default JadwalSholat;
