import React, { useState, useEffect } from 'react';
import HariBesarCard from './HariBesarCard';
import axios from '@/utils/axios';
import AlertConfirm from '../Alerts/AlertConfirm';
import { useRouter } from 'next/navigation';

interface Image {
  id: number;
  keterangan: string;
  kategori: string;
  image: string;
}

interface HariBesar {
  id: number;
  nama_kegiatan: string;
  tanggal: string;
  lokasi: string;
  kategori: string;
  keterangan: string;
  images: Image[];
}

interface ListHariBesarProps {
  refresh: boolean; 
}

const ListHariBesar: React.FC<ListHariBesarProps> = ({ refresh }) => {
  const [haribesarList, setHariBesarList] = useState<HariBesar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const fetchHariBesar = async () => {
    try {
      const response = await axios.get('/kegiatan');
      // Filter data to show only "hari-besar" category
      const filteredData = response.data.filter((item: HariBesar) => item.kategori === 'hari-besar');
      console.log(filteredData);
      setHariBesarList(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching kegiatan:", error);
      setError("Gagal memuat data kegiatan.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHariBesar();
  }, [refresh]);

  const handleEdit = (id: number) => {
    router.push(`/jadwal-sholat/${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedId !== null) {
      try {
        await axios.delete(`/kegiatan/${selectedId}`);
        setHariBesarList(haribesarList.filter(haribesar => haribesar.id !== selectedId));
        setShowConfirm(false);
        setSelectedId(null);
      } catch (error) {
        console.error(`Error deleting kegiatan with ID: ${selectedId}`, error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, 
    };
    const date = new Date(dateString);
    const wibDate = new Date(date.getTime());

    return new Intl.DateTimeFormat('id-ID', options).format(wibDate) + ' WIB';
};

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {showConfirm && (
        <AlertConfirm
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDeleteConfirm} 
          message="Apakah Anda yakin ingin menghapus data ini?"
        />
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {haribesarList.map((haribesar) => {
          const getFotoUrl = haribesar.images.length > 0
            ? `http://localhost:8000/storage/${haribesar.images[0].image}` 
            : 'https://via.placeholder.com/300';

          return (
            <HariBesarCard
              key={haribesar.id}
              nama_kegiatan={haribesar.nama_kegiatan}
              tanggal={formatDate(haribesar.tanggal)}
              lokasi={haribesar.lokasi}
              foto={getFotoUrl}
              onEdit={() => handleEdit(haribesar.id)}
              onDelete={() => handleDelete(haribesar.id)}
            />
          );
        })}
      </div>
    </>
  );
};

export default ListHariBesar;
