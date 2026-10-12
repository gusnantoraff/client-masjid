import React, { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { FaMosque, FaCheckCircle } from 'react-icons/fa';

interface Facility {
  id: number;
  nama_fasilitas: string;
  deskripsi: string;
}

interface InfoMasjid {
  id: number;
  nama_masjid: string;
  deskripsi: string;
  fasilitas: Facility[];
}

interface InfoMasjidProps {
  id?: string;
}

const InfoMasjid: React.FC<InfoMasjidProps> = ({ id }) => {
  const [infoMasjid, setInfoMasjid] = useState<InfoMasjid | null>(null);

  useEffect(() => {
    const fetchMasjidData = async () => {
      try {
        const response = await axios.get('/public/info-masjid');
        setInfoMasjid(response.data[0]);
      } catch (error) {
        console.error("Error fetching masjid data:", error);
      }
    };

    fetchMasjidData();
  }, []);

  if (!infoMasjid) {
    return <div></div>;
  }

  const { nama_masjid, deskripsi, fasilitas } = infoMasjid;

  return (
    <section
      id={id}
      className="mt-30 sm:mt-20 md:mt-[7rem] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 flex flex-col items-center bg-white font-poppins"
      data-aos="fade-down"
      data-aos-delay="200"
    >
      {/* Header */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl text-ijo font-bold flex items-center gap-3 text-center">
        Profil {nama_masjid}
      </h2>
      <hr className="my-4 sm:my-6 w-2/3 sm:w-1/2 lg:w-[30%] mx-auto border-ijo border-2 rounded-lg" />

      {/* Deskripsi */}
      <div className="w-full bg-teal-50 p-6 sm:p-8 shadow-md rounded-lg mt-8 text-gray-700">
        <h3 className="text-xl text-center sm:text-2xl font-semibold mb-4 text-teal-700">{nama_masjid}</h3>
        <p className="leading-relaxed text-justify text-md sm:text-base">{deskripsi}</p>
      </div>

      {/* Total Fasilitas */}
      <div className="mt-8 sm:mt-10 flex justify-center items-center">
        <div className="bg-gradient-to-br from-teal-500 to-ijo shadow-md rounded-lg p-6 sm:p-8 text-center w-full max-w-xs sm:max-w-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-300 opacity-20 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-300 opacity-20 rounded-full"></div>
          <div className="mb-4">
            <FaCheckCircle className="text-white text-4xl sm:text-5xl mx-auto animate-bounce" />
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">Total Fasilitas</h3>
          <p className="text-white text-2xl sm:text-3xl font-semibold mt-3">{fasilitas.length}</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-300 to-teal-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default InfoMasjid;
