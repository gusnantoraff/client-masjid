/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import KegiatanCard from './KegiatanCard';
import axios from '@/utils/axios';
import AlertConfirm from '../Alerts/AlertConfirm';
import { useRouter } from 'next/navigation';

interface Image {
  id: number;
  keterangan: string;
  kategori: string;
  image: string;
}

interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  tanggal: string;
  lokasi: string;
  kategori: string;
  keterangan: string;
  images: Image[];
}

interface ListKegiatanProps {
  refresh: boolean;
  size?: 'small' | 'normal';
  startDate: string;
  endDate: string;
  selectedMonth: string;
}

const ListKegiatan: React.FC<ListKegiatanProps> = ({ refresh, size = 'normal', startDate, endDate, selectedMonth }) => {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const fetchKegiatan = async () => {
    try {
      const params: { [key: string]: string } = {};

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (selectedMonth) params.month = selectedMonth;

      const response = await axios.get('/kegiatan', {
        params: params,
      });

      setKegiatanList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching kegiatan:", error);
      setError("Gagal memuat data kegiatan.");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchKegiatan();
  }, [refresh, startDate, endDate, selectedMonth]);

  const handleEdit = (id: number) => {
    router.push(`/kegiatan/${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedId !== null) {
      try {
        await axios.delete(`/kegiatan/${selectedId}`);
        setKegiatanList(kegiatanList.filter(kegiatan => kegiatan.id !== selectedId));
        setShowConfirm(false);
        setSelectedId(null);
      } catch (error) {
        console.error(`Error deleting kegiatan with ID: ${selectedId}`, error);
      }
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
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
        {kegiatanList.map((kegiatan) => {
          const getFotoUrl = kegiatan.images.length > 0
            ? `http://localhost:8000/storage/${kegiatan.images[0].image}`
            : 'https://via.placeholder.com/300';

          return (
            <KegiatanCard
              key={kegiatan.id}
              nama_kegiatan={truncateText(kegiatan.nama_kegiatan, 20)}
              tanggal={formatDate(kegiatan.tanggal)}
              lokasi={kegiatan.lokasi}
              foto={getFotoUrl}
              size={size}
              onEdit={() => handleEdit(kegiatan.id)}
              onDelete={() => handleDelete(kegiatan.id)}
            />
          );
        })}
      </div>
    </>
  );
};

export default ListKegiatan;
