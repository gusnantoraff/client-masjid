import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk menangani scroll
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsVisible(scrollTop > 200); // Tampilkan tombol jika scroll lebih dari 200px
  };

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Animasi scroll
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-4 bg-ijo text-white font-semibold p-3 rounded-full shadow-lg hover:bg-teal-700 transition duration-300"
          aria-label="Kembali ke atas"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
