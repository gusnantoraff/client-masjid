"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SwiperCore from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import fetchWithAuth from "@/utils/fetch";

SwiperCore.use([Navigation, Pagination]);

interface GaleriProps {
  id?: string;
}

interface ImageType {
  id: number;
  image: string;
  keterangan: string;
}

const Galeri: React.FC<GaleriProps> = ({ id }) => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    fetchWithAuth('https://backend-masjid-production.up.railway.app/public/images?kategori=galeri')
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const displayedImages = showAll ? images : images.slice(0, 10);

  const handleSeeAllClick = () => {
    router.push('/galeri');
  };

  return (
    <section id={id} className="py-15 pb-20 mb-20 px-4 sm:px-6 lg:px-8">
  <h2
    className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 mb-6 font-poppins text-center font-semibold"
    data-aos="fade-down"
  >
    Galeri Foto
  </h2>
  <hr className="my-1 mb-6 border-ijo w-[30%] sm:w-[15%] lg:w-[12%] mx-auto border-2 rounded-lg" />
  <h3
    className="text-sm sm:text-base lg:text-lg text-gray-700 mb-10 font-poppins text-center font-light"
    data-aos="zoom-in"
  >
    Berikut adalah koleksi foto-foto indah dari galeri Masjid Tercode, yang menampilkan berbagai momen berharga
    dalam kehidupan sehari-hari masjid, termasuk acara keagamaan, kegiatan sosial, serta pemandangan masjid yang mempesona.
  </h3>

  <Swiper
    key={displayedImages.length}
    navigation
    pagination={{ clickable: true }}
    spaceBetween={10}
    slidesPerView={1}
    centeredSlides={true}
    loop={true}
    breakpoints={{
      640: { slidesPerView: 2, spaceBetween: 15 },
      1024: { slidesPerView: 3, spaceBetween: 20 },
    }}
    className="mySwiper"
    data-aos="fade"
    data-aos-delay="200"
    data-aos-duration="2000"
  >
    {displayedImages.map((image) => (
      <SwiperSlide key={image.id}>
        <div className="relative w-full h-0 pb-[100%]">
          <Image
            src={`http://localhost:8000/storage/${image.image}`}
            alt={image.keterangan}
            layout="fill"
            objectFit="cover"
            className="rounded-lg mx-auto cursor-pointer"
            onClick={() => handleImageClick(`http://localhost:8000/storage/${image.image}`)}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/300';
            }}
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  {/* "Lihat Semua" Button */}
  {!showAll && (
    <div className="text-center mt-4">
      <button
        onClick={handleSeeAllClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-base sm:text-lg text-ijo font-light bg-white border-2 border-ijo py-2 px-4 rounded-lg font-poppins flex items-center justify-center hover:bg-ijo hover:text-white"
      >
        Lihat Semua Galeri
        <Image
          src={isHovered ? "/images/expand-hover.svg" : "/images/expand.svg"}
          alt="See all icon"
          width={16}
          height={16}
          className="ml-2"
        />
      </button>
    </div>
  )}

  {/* Image Preview Modal */}
  {selectedImage && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClosePreview}
    >
      <div className="relative w-full max-w-md mx-auto">
        <Image
          src={selectedImage}
          alt="Selected Image"
          layout="responsive"
          width={350}
          height={350}
          className="object-contain rounded-lg"
        />
        <button
          onClick={handleClosePreview}
          className="absolute top-2 right-2 text-white text-2xl bg-ijo w-9 h-9 flex items-center justify-center rounded-full"
        >
          &times;
        </button>
      </div>
    </div>
  )}
</section>

  );
};

export default Galeri;
