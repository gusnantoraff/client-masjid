"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
    const [isBeritaDropdownOpen, setIsBeritaDropdownOpen] = useState(false);
    const [isJemaahDropdownOpen, setIsJemaahDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleBeritaDropdown = () => {
        setIsBeritaDropdownOpen(!isBeritaDropdownOpen);
    };

    const toggleJemaahDropdown = () => {
        setIsJemaahDropdownOpen(!isJemaahDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionPosition =
                section.getBoundingClientRect().top + window.scrollY;

            let offset = 30;
            if (sectionId === "infoMasjid") {
                offset = 5;
            } else if (sectionId === "keuangan") {
                offset = 205;
            }

            window.scrollTo({
                top: sectionPosition - offset,
                behavior: "smooth",
            });
        }
    };

    return (
        <header className={`${className}`}>
            <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-8">
                {/* Logo */}
                <Link href="/">
                    <Image
                        width={176}
                        height={32}
                        src={"/images/logo-ijo.png"}
                        alt="Logo"
                        priority
                        className="dark:hidden"
                        style={{
                            width: "auto",
                            height: "50px",
                        }}
                    />
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="block text-2xl text-gray-700 focus:outline-none lg:hidden"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Navigation */}
                <nav
                    className={`${
                        isMobileMenuOpen ? "block" : "hidden"
                    } absolute left-0 top-16 z-20 w-full flex-col bg-white font-poppins text-lg font-semibold shadow-lg lg:relative lg:top-auto lg:z-auto lg:flex lg:w-auto lg:flex-row lg:items-center lg:space-x-8 lg:bg-transparent lg:shadow-none`}
                >
                    <Link
                        href="/"
                        className="block px-4 py-2 text-gray-700 hover:text-gray-500"
                    >
                        Beranda
                    </Link>
                    <Link
                        href="/laporan"
                        className="block px-4 py-2 text-gray-700 hover:text-gray-500"
                    >
                        Keuangan
                    </Link>
                    <Link
                        href="/agenda"
                        className="block px-4 py-2 text-gray-700 hover:text-gray-500"
                    >
                        Kegiatan
                    </Link>
                    <div className="relative">
                        <button
                            onClick={toggleBeritaDropdown}
                            className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-500 focus:outline-none"
                        >
                            Berita
                            <FaAngleDown className="ml-2" />
                        </button>
                        {isBeritaDropdownOpen && (
                            <div
                                className="absolute left-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg lg:backdrop-blur-lg lg:backdrop-filter"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                }}
                            >
                                <Link
                                    href="/news"
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
                                >
                                    Berita
                                </Link>
                                <Link
                                    href="/galeri"
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
                                >
                                    Galeri
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button
                            onClick={toggleJemaahDropdown}
                            className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-500 focus:outline-none"
                        >
                            Jemaah
                            <FaAngleDown className="ml-2" />
                        </button>
                        {isJemaahDropdownOpen && (
                            <div
                                className="absolute left-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg lg:backdrop-blur-lg lg:backdrop-filter"
                                style={{
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                }}
                            >
                                <Link
                                    href="/jemaah"
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
                                >
                                    Jamaah
                                </Link>
                                <Link
                                    href="/yatim"
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-300"
                                >
                                    Yatim
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/profil"
                        className="block px-4 py-2 text-gray-700 hover:text-gray-500"
                    >
                        Profil Masjid
                    </Link>
                    <button
                        onClick={() => scrollToSection("footer")}
                        className="block w-full rounded-lg bg-ijo px-4 py-2 text-center text-white hover:bg-green-light-7 lg:w-auto"
                    >
                        Kontak
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
