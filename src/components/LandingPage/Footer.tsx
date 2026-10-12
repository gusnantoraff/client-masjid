import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhone,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FaCircleInfo, FaUserGroup } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

interface FooterProps {
    id?: string;
}

interface InfoMasjid {
    id: number;
    nama_masjid: string;
    alamat: string;
    kontak: string;
}

interface RekeningBank {
    id: number;
    nama_bank: string;
    nomor_rekening: string;
    atas_nama: string;
}

const Footer: React.FC<FooterProps> = ({ id }) => {
    const [infoMasjid, setInfoMasjid] = useState<InfoMasjid | null>(null);
    const [isBeritaDropdownOpen, setIsBeritaDropdownOpen] = useState(false);
    const [isJemaahDropdownOpen, setIsJemaahDropdownOpen] = useState(false);

    useEffect(() => {
        // Mendapatkan data masjid dari API
        axios
            .get("/public/info-masjid/1")
            .then((response) => {
                setInfoMasjid(response.data);
            })
            .catch((error) => {
                console.error("Error fetching info masjid", error);
            });
    }, []);

    const toggleBeritaDropdown = () => {
      setIsBeritaDropdownOpen(!isBeritaDropdownOpen);
  };

  const toggleJemaahDropdown = () => {
      setIsJemaahDropdownOpen(!isJemaahDropdownOpen);
  };

    return (
        <footer
            id={id}
            className="bg-gray-200 py-8 font-poppins font-semibold text-gray-700"
        >
            <div className="container mx-auto flex flex-col items-center space-y-6 px-4 sm:px-6 md:px-8 sm:py-6">
  <div className="flex flex-col justify-center text-center md:flex-row md:space-x-20 md:text-left">
    {/* Deskripsi */}
    <div className="flex flex-col items-center justify-start space-y-4 text-center md:w-2/5 md:items-start md:text-left">
      <img
        src="/images/logo.png"
        alt="Logo Masjid"
        className="w-36 h-12 md:w-40 md:h-14"
      />
      <p className="font-light text-gray-700 text-sm md:text-base">
        Masjid hadir sebagai tempat ibadah umat, pusat dakwah, pendidikan, kajian keagamaan, dan kegiatan sosial.
      </p>
      <div className="flex items-center justify-center gap-4 py-2">
        <a
          href="https://youtube.com"
          target="_blank"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-600 text-red-600 transition duration-300 hover:bg-red-600 hover:text-white"
        >
          <FaYoutube size={16} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-pink-500 text-pink-500 transition duration-300 hover:bg-pink-500 hover:text-white"
        >
          <FaInstagram size={16} />
        </a>
      </div>
    </div>

    {/* Informasi Section */}
    <div className="flex flex-col items-center space-y-2 md:items-start">
      <div className="flex items-center gap-4">
        {/* <FaCircleInfo className="text-ijo" size={24} /> */}
        <h3 className="text-lg font-semibold text-gray-700">Informasi</h3>
      </div>
      <a
        href="/laporan"
        className="block font-light text-gray-700 hover:text-gray-500"
      >
        Keuangan
      </a>
      <a
        href="/kegiatanmasjid"
        className="block font-light text-gray-700 hover:text-gray-500"
      >
        Kegiatan
      </a>
      <div className="relative">
        <button
          onClick={toggleBeritaDropdown}
          className="flex items-center font-light text-gray-700 hover:text-gray-500 focus:outline-none"
        >
          Berita
          <IoIosArrowDown className="ml-2" />
        </button>
        {isBeritaDropdownOpen && (
          <div
            className="absolute left-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg lg:backdrop-blur-lg"
          >
            <a
              href="/beritamasjid"
              className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
            >
              Berita
            </a>
            <a
              href="/galeri"
              className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
            >
              Galeri
            </a>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          onClick={toggleJemaahDropdown}
          className="flex items-center font-light text-gray-700 hover:text-gray-500 focus:outline-none"
        >
          Jemaah
          {/* <IoIosArrowDown className="ml-2" /> */}
        </button>
        {isJemaahDropdownOpen && (
          <div
            className="absolute left-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg lg:backdrop-blur-lg"
          >
            <a
              href="/jemaah"
              className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
            >
              Jamaah
            </a>
            <a
              href="/yatim"
              className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
            >
              Yatim
            </a>
          </div>
        )}
      </div>
      <a
        href="/profil"
        className="block font-light text-gray-700 hover:text-gray-500"
      >
        Profil Masjid
      </a>
    </div>

    {/* Address Section */}
    <div className="flex flex-col items-center space-y-2 md:items-start">
      <div className="flex items-center gap-4">
        {/* <FaMapMarkerAlt className="text-ijo" size={24} /> */}
        <h3 className="text-lg font-semibold text-gray-700">Alamat Lengkap</h3>
      </div>
      <p className="text-sm font-light">{infoMasjid?.alamat || 'Alamat tidak tersedia'}</p>
      <a
        href={`https://www.google.com/maps/search/?q=${encodeURIComponent(infoMasjid?.alamat ?? "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full md:w-3/4"
      >
        <img
          src="/images/maps.png"
          alt="Peta Lokasi Masjid"
          className="w-full rounded-lg"
        />
      </a>
    </div>
  </div>

  {/* Footer Bottom Text */}
  <div className="w-full border-t border-gray-400 pt-4 text-center text-sm font-light text-gray-500">
    <p>Masjid Tercode</p>
    <p>Copyright &copy; 2024</p>
  </div>
</div>


            
        </footer>
    );
};

export default Footer;
