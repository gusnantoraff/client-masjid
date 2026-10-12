"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import axios from "@/utils/axios";
import { BiCalendar, BiMap } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

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
    const [navbarBg, setNavbarBg] = useState(false);

    useEffect(() => {
        const fetchKegiatan = async () => {
            try {
                const response = await axios.get("/public/kegiatan");
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

    console.log("data", kegiatan);

    console.log("data", kegiatan);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        const date = new Date(dateString);
        const wibDate = new Date(date.getTime());

        return (
            new Intl.DateTimeFormat("id-ID", options).format(wibDate) + " WIB"
        );
    };

    return (
      <div className="flex min-h-screen flex-col">
      <Navbar
        className={`fixed left-0 top-0 z-50 h-[78px] w-full ${navbarBg ? "bg-white" : "bg-white"}`}
      />
      <div
        style={{
          backgroundImage: "url(/images/jemaah-bg.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
        className="mt-20 sm:mt-25 flex h-[200px] sm:h-[250px] w-full items-center justify-center"
      >
        <h2 className="flex items-center gap-3 text-center font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          Kegiatan
        </h2>
      </div>
    
      <section
        className="flex flex-col items-center bg-white px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-10 font-poppins sm:mt-20 md:mt-15"
        data-aos="fade-down"
        data-aos-delay="200"
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 md:px-12 lg:px-20"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          {kegiatan.map((item) => (
            <div
              key={item.id}
              className="group w-full flex-shrink-0 transform overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative mb-4 h-48 sm:h-56 md:h-64 lg:h-72 w-full">
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
              <div className="px-6 pb-3">
                <h3 className="mb-2 text-xl sm:text-2xl font-semibold text-gray-700">
                  {item.id === -1 ? "Tidak ada kegiatan terdekat" : item.nama_kegiatan}
                </h3>
                {item.id !== -1 && (
                  <>
                    <div className="mb-2 flex items-center text-gray-700">
                      <BiCalendar
                        size={20}
                        style={{
                          marginRight: "5px",
                          color: "#14B8A6",
                        }}
                      />
                      {formatDate(item.tanggal)}
                    </div>
                    <div className="mb-4 flex items-center text-gray-700">
                      <BiMap
                        size={20}
                        style={{
                          marginRight: "5px",
                          color: "#F97F30",
                        }}
                      />
                      {item.lokasi}
                    </div>
                  </>
                )}
              </div>
              
            </div>
          ))}
        </div>
      </section>
      <Footer id="footer" />
    </div>
    
    );
};

export default KegiatanTerdekat;
