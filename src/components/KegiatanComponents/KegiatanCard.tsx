import React from 'react';
import { BiEdit, BiTrash, BiMap, BiCalendar } from 'react-icons/bi';
import Image from 'next/image';

interface KegiatanCardProps {
  nama_kegiatan: string;
  tanggal: string;
  lokasi: string;
  foto: string;
  onEdit: () => void;
  onDelete: () => void;
  size?: 'small' | 'normal';
}

const KegiatanCard: React.FC<KegiatanCardProps> = ({ nama_kegiatan, tanggal, lokasi, foto, onEdit, onDelete, size = 'normal' }) => {
  const dimensions = {
    small: { 
      cardWidth: '380px', 
      cardHeight: '175px', 
      imgWidth: 0, 
      imgHeight: 0, 
      fontSize: '14px', 
      buttonSize: '12px', 
      iconSize: 16,
      margin: '6px'
    },
    normal: { 
      cardWidth: '565px', 
      cardHeight: '200px', 
      imgWidth: 230, 
      imgHeight: 175, 
      fontSize: '16px', 
      buttonSize: '14px', 
      iconSize: 20,
      margin: '15px 15px 0 15px'
    },
  };

  const currentDimensions = dimensions[size];

  return (
    <div className="card" style={{ width: currentDimensions.cardWidth, height: currentDimensions.cardHeight, margin: currentDimensions.margin }}>
      {size === 'normal' && (
        <Image
          src={foto}
          alt={nama_kegiatan}
          width={currentDimensions.imgWidth}
          height={currentDimensions.imgHeight}
          objectFit="cover"
          className="rounded-tl-md rounded-bl-md"
        />
      )}
      <div className="card-content">
        <h3 style={{ fontSize: currentDimensions.fontSize }}>{nama_kegiatan}</h3>
        <p style={{ fontSize: currentDimensions.fontSize }}>
          <BiMap size={currentDimensions.iconSize} style={{ marginRight: '5px', color: '#F97F30' }} /> {lokasi}
        </p>
        <p style={{ fontSize: currentDimensions.fontSize }}>
          <BiCalendar size={currentDimensions.iconSize} style={{ marginRight: '5px', color: '#14B8A6' }} /> {tanggal}
        </p>
        <div className="card-actions">
          <button className="delete-button" style={{ fontSize: currentDimensions.buttonSize }} onClick={onDelete}>
            <BiTrash size={currentDimensions.iconSize} /> Hapus
          </button>
          <button className="edit-button" style={{ fontSize: currentDimensions.buttonSize }} onClick={onEdit}>
            <BiEdit size={currentDimensions.iconSize} /> Edit
          </button>
        </div>
      </div>

      <style jsx>{`
        .card {
          display: flex;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          background-color: white;
        }
        .card-content {
          flex-grow: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-weight: 600;
        }
        p {
          margin: 4px 0;
          display: flex;
          align-items: center;
        }
        .card-actions {
          display: flex;
          justify-content: right;
          margin-top: 12px;
        }
        .edit-button, .delete-button {
          display: flex;
          align-items: center;
          margin-left: 10px;
          background-color: #f5f5f5;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          color: #333;
        }
        .edit-button {
          background-color: #14B8A6;
          color: white;
        }
        .delete-button {
          background-color: #d50000;
          color: white;
        }
        .edit-button:hover {
          background-color: #0f9d89;
        }
        .delete-button:hover {
          background-color: #b71c1c;
        }
      `}</style>
    </div>
  );
};

export default KegiatanCard;
