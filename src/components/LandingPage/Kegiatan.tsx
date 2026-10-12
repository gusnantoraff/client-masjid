import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { BiCalendar, BiMap } from 'react-icons/bi';
import { FaArrowRight } from "react-icons/fa6";
import Image from 'next/image';
import Link from 'next/link';

interface Image {
  id: number;
  keterangan: string;
  kategori: string;
  image: string;
}

interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  tanggal: string;
  lokasi: string;
  images: Image[];
}

interface KegiatanTerdekatProps {
  id?: string;
}

const KegiatanTerdekat: React.FC<KegiatanTerdekatProps> = ({ id }) => {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const response = await axios.get('/public/kegiatan');
        const kegiatanData: Kegiatan[] = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysAhead = new Date(today);
        sevenDaysAhead.setDate(today.getDate() + 7);

        const filteredKegiatan = kegiatanData.filter((item) => {
          const eventDate = new Date(item.tanggal);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today && eventDate <= sevenDaysAhead;
        });

        const sortedKegiatan = filteredKegiatan.sort((a, b) => {
          const dateA = new Date(a.tanggal);
          const dateB = new Date(b.tanggal);
          return dateA.getTime() - dateB.getTime();
        });

        const activitiesToDisplay = sortedKegiatan.slice(0, 3);

        while (activitiesToDisplay.length < 3) {
          activitiesToDisplay.push({
            id: -1,
            nama_kegiatan: "Tidak ada kegiatan terdekat",
            tanggal: "",
            lokasi: "",
            images: [],
          });
        }

        setKegiatan(activitiesToDisplay);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching kegiatan:", error);
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, []);

  console.log('data',kegiatan);

  console.log('data',kegiatan);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const date = new Date(dateString);
    const wibDate = new Date(date.getTime());

    return new Intl.DateTimeFormat('id-ID', options).format(wibDate) + ' WIB';
  };


  return (
    <section
    id={id}
    className="py-20 lg:py-24 bg-cover bg-center font-poppins font-semibold"
    style={{
      backgroundImage: "url('/images/BG.png')",
      marginBottom: "40px",
    }}
  >
    <h2
      className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 mb-6 text-center text-white"
      data-aos="fade-down"
      data-aos-delay="200"
    >
      Kegiatan Terdekat
    </h2>
    <hr className="my-1 mb-8 border-white w-1/3 sm:w-[17%] mx-auto border-2 rounded-lg" />
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-10 lg:px-20"
      data-aos="zoom-in"
      data-aos-delay="200"
    >
      {kegiatan.map((item) => (
        <div
          key={item.id}
          className="group bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl relative overflow-hidden flex-shrink-0 w-full"
        >
          <div className="relative w-full h-48 sm:h-56 lg:h-64 mb-4">
            <Image
              src={
                item.id === -1
                  ? "/images/placeholder.png"
                  : item.images && item.images.length > 0
                  ? `http://localhost:8000/storage/${item.images[0].image}`
                  : "/images/placeholder.png"
              }
              alt={item.nama_kegiatan || "Tidak ada kegiatan terdekat"}
              layout="fill"
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
            />
          </div>
          <div className="px-4 sm:px-6 pb-3">
            <h3 className="text-lg sm:text-xl text-gray-700 font-semibold mb-2">
              {item.id === -1 ? "Tidak ada kegiatan terdekat" : item.nama_kegiatan}
            </h3>
            {item.id !== -1 && (
              <>
                <div className="flex items-center text-sm sm:text-base text-gray-700 mb-2">
                  <BiCalendar size={18} className="mr-2 text-teal-500" />{" "}
                  {formatDate(item.tanggal)}
                </div>
                <div className="flex items-center text-sm sm:text-base text-gray-700 mb-4">
                  <BiMap size={18} className="mr-2 text-orange-500" /> {item.lokasi}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
  
  );
};

export default KegiatanTerdekat;
