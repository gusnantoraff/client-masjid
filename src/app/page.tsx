"use client";
import { useEffect, useState } from 'react';

import Navbar from '@/components/LandingPage/Navbar';
import Banner from '@/components/LandingPage/Banner';
import KegiatanTerdekat from '@/components/LandingPage/Kegiatan';
import Keuangan from '@/components/LandingPage/Keuangan';
import InfoMasjid from '@/components/LandingPage/InfoMasjid';
import Galeri from '@/components/LandingPage/Galeri';
import NewsSection from '@/components/LandingPage/Berita';
import Footer from '@/components/LandingPage/Footer';
import JamDigital from '@/components/LandingPage/JamDigital';
import BackToTopButton from '@/components/LandingPage/ButtonKeAtas';


const Home = () => {
  const [navbarBg, setNavbarBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const infoMasjidSection = document.getElementById("infoMasjid");
      if (infoMasjidSection) {
        const sectionTop = infoMasjidSection.offsetTop;
        const scrollTop = window.scrollY;

        if (scrollTop >= sectionTop - 50) {
          setNavbarBg(true);
        } else {
          setNavbarBg(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Mencegah scroll horizontal
    document.body.style.overflowX = "hidden";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Mengembalikan pengaturan scroll saat komponen unmount
      document.body.style.overflowX = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <div
    className="flex flex-col min-h-screen"
    style={{
      maxWidth: "100vw",  // Membatasi lebar elemen root ke lebar layar
      overflowX: "hidden",  // Mencegah scroll horizontal
    }}
  >
      {/* Jam Digital */}
      <JamDigital />

      <BackToTopButton/>

      {/* Navbar */}
      <Navbar className="fixed top-0 left-0 w-full z-50 h-[78px] bg-white" />

      {/* Banner */}
      <Banner id="home" />

      <main className="flex-grow pt-16">
        {/* Info Masjid and Keuangan Section */}
        <div className="container mx-auto px-4 md:px-10 lg:px-20 pb-10 mt-30">
          <InfoMasjid id="infoMasjid" />
          <Keuangan id="keuangan"/>
        </div>

        {/* Kegiatan Terdekat Section */}
        <div className="w-full px-4 md:px-10 lg:px-20">
          <KegiatanTerdekat id="kegiatan" />
        </div>

        {/* News and Galeri Section */}
        <div className="container mx-auto px-4 md:px-10 lg:px-20">
          <NewsSection id="berita" />
          <Galeri id="galeri" />
        </div>
      </main>

      {/* Footer */}
      <Footer id="footer" />
    </div>
  );
};

export default Home;
