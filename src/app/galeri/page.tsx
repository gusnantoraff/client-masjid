"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import fetchWithAuth from "@/utils/fetch";

interface ImageType {
    id: number;
    image: string;
    keterangan: string;
}

const Galeri: React.FC = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchWithAuth('http://localhost:8000/api/public/images?kategori=galeri')
            .then(data => setImages(data))
            .catch(error => console.error('Error fetching images:', error));
    }, []);

    console.log('data',images);

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
    };

    const handleClosePreview = () => {
        setSelectedImage(null);
    };

    const handleClosePage = () => {
        router.push('/');
    };

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-700 mb-6 font-poppins text-center font-semibold">
          Galeri Foto
        </h2>
        <hr className="my-1 mb-6 border-ijo w-[30%] sm:w-[20%] lg:w-[12%] mx-auto border-2" />
        <h3 className="px-2 sm:px-10 text-sm sm:text-base lg:text-lg text-gray-700 mb-10 font-poppins text-center font-light">
          Berikut adalah koleksi foto-foto indah dari galeri Masjid Tercode, yang menampilkan berbagai momen berharga
          dalam kehidupan sehari-hari masjid, termasuk acara keagamaan, kegiatan sosial, serta pemandangan masjid yang mempesona.
        </h3>
      
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-auto max-h-[600px]">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative cursor-pointer"
              onClick={() => handleImageClick(`http://localhost:8000/storage/${image.image}`)}
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-60">
                <Image
                  src={`http://localhost:8000/storage/${image.image}`}
                  alt={image.keterangan}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300';
                  }}
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">{image.keterangan}</p>
            </div>
          ))}
        </div>
      
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
      
        {/* Close button for navigation */}
        <button
          onClick={handleClosePage}
          className="fixed top-5 right-10 text-white text-xl sm:text-2xl bg-ijo w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full"
        >
          &times;
        </button>
      </section>
      
    );
};

export default Galeri;
