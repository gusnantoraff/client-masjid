"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import { FaRegCalendarAlt } from "react-icons/fa";
import axios from "@/utils/axios";
import Image from "next/image";

interface Berita {
    id: number;
    judul: string;
    konten: string;
    tanggal_publikasi: string;
    kategori: string;
    status: string;
    foto: string;
}

interface NewsSectionProps {
    id?: string;
}

const NewsSection: React.FC<NewsSectionProps> = ({ id }) => {
    const [berita, setBerita] = useState<Berita[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [navbarBg, setNavbarBg] = useState(false);

    useEffect(() => {
        const fetchBerita = async () => {
            try {
                const response = await axios.get("/public/berita");
                setBerita(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching berita:", error);
                setLoading(false);
            }
        };

        fetchBerita();
    }, []);

    const truncateText = (text: string, maxLength: number): string => {
        return text.length > maxLength
            ? `${text.slice(0, maxLength)}...`
            : text;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

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
            {/* Header */}
            <div
                style={{
                    backgroundImage: "url(/images/jemaah-bg.jpeg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                }}
                className="mt-25 flex h-[250px] w-full items-center justify-center"
            >
                <h2 className="flex items-center gap-3 text-center font-poppins text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                    Berita
                </h2>
            </div>
            <section
                className="flex flex-col items-center bg-white px-4 py-10 font-poppins sm:mt-20 sm:px-6 md:mt-15 md:px-12 lg:px-20 xl:px-28"
                data-aos="fade-down"
                data-aos-delay="200"
            >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 px-4 sm:px-6 md:px-8">
                  {/* Main featured news */}
                  <div 
                    className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden hover:cursor-pointer h-full" 
                    data-aos="fade-right" 
                    data-aos-delay="200"
                  >
                    <div className="relative w-full h-64 lg:h-full overflow-hidden group">
                      <Image
                        src={berita[0]?.foto ? `http://localhost:8000/storage/${berita[0].foto}` : '/images/600x400.png'}
                        alt={berita[0]?.judul || 'Main News Placeholder'}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-poppins">
                          {berita[0]?.judul || 'Tidak ada berita terbaru'}
                        </h3>
                        <p className="text-white text-xs font-poppins flex items-center">
                          <FaRegCalendarAlt className="h-4 w-4 mr-2 text-white" />
                          {berita[0]?.tanggal_publikasi ? formatDate(berita[0].tanggal_publikasi) : 'Tidak Tersedia'}
                        </p>
                      </div>
                    </div>
                  </div>
                
                  {/* List of smaller news items */}
                  <div className="col-span-1 lg:col-span-2 grid grid-cols-1 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => {
                      const item = berita[index + 1] || { foto: null, judul: '', tanggal_publikasi: '' };
                
                      return (
                        <div 
                          key={index} 
                          className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transform transition-all duration-300 ease-in-out" 
                          data-aos="fade-left" 
                          data-aos-delay="200"
                        >
                          <div className="flex-shrink-0 w-full h-40 lg:w-60 relative overflow-hidden">
                            <Image
                              src={item.foto ? `http://localhost:8000/storage/${item.foto}` : '/images/250x160.png'}
                              alt={item.judul || 'Placeholder'}
                              layout="fill"
                              objectFit="cover"
                              className="w-full h-full object-cover rounded-l-lg"
                            />
                          </div>
                          <div className="flex flex-col justify-between w-full p-4">
                            <h3 className="text-sm sm:text-lg text-gray-700 font-semibold font-poppins">
                              {truncateText(item.judul || 'Tidak ada berita terbaru', 30)}
                            </h3>
                            <p className="text-gray-700 text-xs font-poppins flex items-center py-1 font-light">
                              <FaRegCalendarAlt className="h-4 w-4 mr-2 text-oren" />
                              {item.tanggal_publikasi ? formatDate(item.tanggal_publikasi) : 'Tidak Tersedia'}
                            </p>
                            <button className="mt-4 text-ijo text-xs sm:text-sm font-poppins hover:underline">
                              Baca Selengkapnya
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            </section>
            <Footer id="footer" />
        </div>
    );
};

export default NewsSection;
