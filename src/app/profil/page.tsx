"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import axios from "@/utils/axios";
import { FaMosque, FaCheckCircle } from "react-icons/fa";

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

const Profil: React.FC<InfoMasjidProps> = ({ id }) => {
    const [infoMasjid, setInfoMasjid] = useState<InfoMasjid | null>(null);
    const [navbarBg, setNavbarBg] = useState(false);

    useEffect(() => {
        const fetchMasjidData = async () => {
            try {
                const response = await axios.get("/public/info-masjid");
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
                    Profil {nama_masjid}
                </h2>
            </div>

            <section
                id={id}
                className="mt-5 flex flex-col items-center bg-white px-4 py-10 font-poppins sm:mt-20 sm:px-6 md:mt-15 md:px-12 lg:px-20 xl:px-28"
                data-aos="fade-down"
                data-aos-delay="200"
            >
                {/* Deskripsi */}
                <div className="mt-8 w-full rounded-lg bg-amber-300 p-4 text-blue-800 shadow-md sm:p-6 lg:p-8">
                    <h3 className="mb-4 text-center text-lg font-semibold text-blue-800 sm:text-xl lg:text-2xl">
                        {nama_masjid}
                    </h3>
                    <p className="text-justify text-sm leading-relaxed sm:text-base lg:text-lg">
                        {deskripsi}
                    </p>
                </div>

                {/* Struktur Organisasi */}
                <div className="mt-8 flex w-full flex-col items-center justify-center rounded-lg bg-amber-300 p-4 text-gray-700 shadow-md sm:p-6 lg:p-8">
                    <h3 className="mb-4 text-center text-lg font-semibold text-blue-800 sm:text-xl lg:text-2xl">
                        Struktur {nama_masjid}
                    </h3>
                    <img
                        src={"/images/struktur (2).png"}
                        alt="Struktur Organisasi"
                        className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:w-1/2"
                    />
                </div>

                {/* Total Fasilitas */}
                <div className="mt-8 flex items-center justify-center sm:mt-10">
                    <div className="relative w-full max-w-xs overflow-hidden rounded-lg bg-gradient-to-br from-teal-500 to-ijo p-6 text-center shadow-md sm:max-w-sm sm:p-8 lg:max-w-md">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-300 opacity-20 lg:h-40 lg:w-40"></div>
                        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-300 opacity-20 lg:h-48 lg:w-48"></div>
                        <div className="mb-4">
                            <FaCheckCircle className="mx-auto animate-bounce text-3xl text-white sm:text-4xl lg:text-5xl" />
                        </div>
                        <h3 className="text-base font-bold tracking-wide text-white sm:text-lg lg:text-xl">
                            Total Fasilitas
                        </h3>
                        <p className="mt-3 text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
                            {fasilitas.length}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-green-300 to-teal-500"></div>
                    </div>
                </div>
            </section>

            <Footer id="footer" />
        </div>
    );
};

export default Profil;
