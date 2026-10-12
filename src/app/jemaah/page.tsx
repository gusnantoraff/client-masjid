"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import axios from "@/utils/axios";

interface Jamaah {
    id: number; // bigint(20) UNSIGNED
    gender: "pria" | "wanita"; // enum('pria', 'wanita') NOT NULL
    keterangan: "aktif" | "pindah" | "wafat"; // enum('aktif', 'pindah', 'wafat') NOT NULL DEFAULT 'aktif'
}

interface InfoMasjid {
    id: number; // bigint(20) UNSIGNED
    nama_masjid: string; // varchar(255) NOT NULL
}

const Profil = () => {
    const [navbarBg, setNavbarBg] = useState(false);
    const [infoMasjid, setInfoMasjid] = useState<InfoMasjid | null>(null);
    const [countMuslimAktif, setMuslimAktif] = useState(0);
    const [countMuslimahAktif, setMuslimahAktif] = useState(0);

    useEffect(() => {
        const fetchMasjidData = async () => {
            try {
                const response = await axios.get("/public/info-masjid");
                setInfoMasjid(response.data[0]);
            } catch (error) {
                console.error("Error fetching masjid data:", error);
            }
        };

        const fetchJamaah = async () => {
            try {
                // Fetch data jamaah dari endpoint
                const response = await axios.get("/public/jamaah");

                // Pastikan data berupa array dan hitung jumlah pria dan wanita aktif
                const data = response.data;
                if (Array.isArray(data)) {
                    const priaAktif = data.filter(
                        (jamaah) =>
                            jamaah.gender === "pria" &&
                            jamaah.keterangan === "aktif",
                    ).length;
                    const wanitaAktif = data.filter(
                        (jamaah) =>
                            jamaah.gender === "wanita" &&
                            jamaah.keterangan === "aktif",
                    ).length;

                    setMuslimAktif(priaAktif);
                    setMuslimahAktif(wanitaAktif);
                } else {
                    console.error("Invalid data format. Expected an array.");
                }
            } catch (error) {
                console.error("Error fetching jamaah data:", error);
            }
        };

        fetchJamaah();
        fetchMasjidData();
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
  <Navbar
    className={`fixed left-0 top-0 z-50 h-[78px] w-full ${navbarBg ? "bg-white" : "bg-white"}`}
  />

  {/* HEADER */}
  <div
    style={{
      backgroundImage: "url(/images/jemaah-bg.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }}
    className="mt-20 sm:mt-25 flex h-[200px] sm:h-[250px] w-full items-center justify-center"
  >
    <h2 className="flex items-center gap-3 text-center font-poppins text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
      Jamaah {infoMasjid?.nama_masjid}
    </h2>
  </div>

  <section
    className="flex flex-col items-center bg-white px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-10 font-poppins sm:mt-20 md:mt-15"
    data-aos="fade-down"
    data-aos-delay="200"
  >
    <h3 className="mb-4 mt-4 text-center text-xl font-semibold text-blue-800 sm:text-2xl">
    Jamaah Masjid menyediakan informasi lengkap tentang jamaah, mempermudah pengelolaan data, dan mendukung komunikasi serta kegiatan masjid secara efektif.    </h3>

    {/* Flexbox Container with Responsiveness */}
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center items-center sm:justify-between">
      {/* Card 1 */}
      <div className="mt-8 flex items-center justify-center sm:mt-10">
        <div className="relative w-full min-w-[150px] max-w-xs overflow-hidden rounded-lg bg-gradient-to-br from-teal-500 to-ijo p-6 text-center shadow-md sm:max-w-sm sm:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-300 opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-300 opacity-20"></div>
          <div className="mb-4">
            <img
              src="/images/muslim.png"
              style={{ width: "64px", height: "64px" }}
              className="mx-auto text-4xl text-white sm:text-5xl"
            />
          </div>
          <h3 className="text-lg font-bold tracking-wide text-white sm:text-2xl">
            Akhi
          </h3>
          <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            {countMuslimAktif}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-green-300 to-teal-500"></div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="mt-8 flex items-center justify-center sm:mt-10">
        <div className="relative w-full min-w-[150px] max-w-xs overflow-hidden rounded-lg bg-gradient-to-br from-teal-500 to-ijo p-6 text-center shadow-md sm:max-w-sm sm:p-8">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-300 opacity-20"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-300 opacity-20"></div>
          <div className="mb-4">
            <img
              src="/images/muslimah.png"
              style={{ width: "64px", height: "64px" }}
              className="mx-auto text-4xl text-white sm:text-5xl"
            />
          </div>
          <h3 className="text-lg font-bold tracking-wide text-white sm:text-2xl">
            Ukhti
          </h3>
          <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
            {countMuslimahAktif}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-green-300 to-teal-500"></div>
        </div>
      </div>
    </div>
  </section>

  <Footer id="footer" />
</div>

    );
};

export default Profil;
