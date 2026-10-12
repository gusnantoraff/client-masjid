"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";
import axios from "@/utils/axios";
import { Container } from "postcss";

interface RekeningBank {
    id: number;
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
}

const Profil = () => {
    const [navbarBg, setNavbarBg] = useState(false);
    const [rekeningData, setRekeningData] = useState<RekeningBank | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk mengontrol modal

    useEffect(() => {
        // Contoh mendapatkan data rekening dari API
        axios
            .get("/public/rekening-bank/1") // Ganti dengan URL yang sesuai
            .then((response) => {
                setRekeningData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching rekening data", error);
            });

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setNavbarBg(true);
            } else {
                setNavbarBg(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fungsi untuk membuka dan menutup modal
    const toggleModal = () => {
        console.log("Toggling modal, current state:", isModalOpen); // Debugging log
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="flex min-h-screen flex-col">
  <Navbar
    className={`fixed left-0 top-0 z-50 h-[78px] w-full ${navbarBg ? "bg-white" : "bg-white"}`}
  />

  {/* HEADER */}
  <div
    style={{
      backgroundImage: "url(/images/yatim-bg.jpeg)",
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }}
    className="flex h-[200px] sm:h-[250px] w-full items-center justify-center mt-20 sm:mt-25"
  >
    <h2 className="flex items-center gap-3 text-center font-poppins text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
      Yatim & Dhuafa
    </h2>
  </div>

  <section
    className="flex flex-col items-center bg-white px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-10 font-poppins sm:mt-20 md:mt-15"
    data-aos="fade-down"
    data-aos-delay="200"
  >
    {/* Informasi Rekening Button */}
    <button
      onClick={toggleModal}
      className="mt-4 block w-full rounded-lg bg-ijo px-4 py-2 sm:py-4 text-center text-white hover:bg-green-light-7 lg:w-auto"
    >
      Informasi Rekening Donasi
    </button>

    {/* Tentang Yatim & Dhuafa Section */}
    <div className="mt-8 w-full flex flex-col items-center justify-center rounded-lg bg-amber-300 p-6 text-gray-700 shadow-md sm:p-8">
      <h3 className="mb-4 text-center text-xl font-semibold text-blue-800 sm:text-2xl">
        Tentang Yatim & Dhuafa
      </h3>
      <h3 className="mb-4 text-center font-medium text-blue-800 sm:text-sm">
        عَنْ سَهْلٍ بْنِ سَعْدٍ قَالَ : قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ : ” أَنَا وَكَافِلُ
        الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا ، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى وَفَرَّجَ بَيْنَهُمَا
        شَيْئًا
        <br />
        “Rasulullah SAW bersabda: “Saya dan orang yang memelihara anak yatim itu dalam surga seperti ini.”
        <br />
        Beliau mengisyaratkan dengan jari telunjuk dan jari tengahnya serta merenggangkan keduanya.”
      </h3>
      <img
        src={"/images/yatim3.jpg"}
        alt="Description of Image"
        className="w-1/2 sm:w-3/4 md:w-1/2 rounded-lg shadow-md"
      />
    </div>

    {/* Modal untuk Rekening Bank */}
    {isModalOpen && rekeningData && (
      <div className="fixed inset-0 z-50 z-[1000] flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="w-4/5 sm:w-1/2 rounded-lg bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-center text-xl font-semibold text-teal-700 sm:text-2xl">
            Informasi Rekening Bank
          </h3>
          <div className="w-full space-y-4">
            <div className="flex justify-between">
              <span className="font-semibold text-teal-700">Nama Bank:</span>
              <span className="text-gray-700">{rekeningData.nama_bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-teal-700">Nomor Rekening:</span>
              <span className="text-gray-700">{rekeningData.nomor_rekening}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-teal-700">Atas Nama:</span>
              <span className="text-gray-700">{rekeningData.atas_nama}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={toggleModal}
              className="rounded-lg bg-red-600 px-6 py-2 text-white transition duration-300 hover:bg-red-700"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Download Data Anak Button */}
    <button className="mt-4 block w-full rounded-lg bg-ijo px-4 py-2 sm:py-4 text-center text-white hover:bg-green-light-7 lg:w-auto">
      Download Data Anak
    </button>
  </section>

  <Footer />
</div>

    );
};

export default Profil;
