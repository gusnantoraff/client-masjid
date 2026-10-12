import React from 'react';
import { BiEdit, BiTrash, BiDetail, BiDownload } from 'react-icons/bi';

interface SuratCardProps {
  judul_surat: string;
  isi_surat: string;
  tanda_tangan: string;
  stempel: string;
  onEdit: () => void;
  onDelete: () => void;
  onDetail: () => void;
  onExportPDF: () => void;
}

const SuratCard: React.FC<SuratCardProps> = ({ judul_surat, isi_surat, tanda_tangan, stempel, onEdit, onDelete, onDetail, onExportPDF }) => {
  return (
    <div className="card">
      <h3 className="card-title">{judul_surat}</h3>
      <div className="card-actions">
        <button className="action-button detail-button" onClick={onDetail}>
          <BiDetail size={20} /> Detail
        </button>
        <button className="action-button pdf-button" onClick={onExportPDF}>
          <BiDownload size={20} /> Print PDF
        </button>
        <button className="action-button edit-button" onClick={onEdit}>
          <BiEdit size={20} /> Edit
        </button>
        <button className="action-button delete-button" onClick={onDelete}>
          <BiTrash size={20} /> Hapus
        </button>
      </div>

      <style jsx>{`
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin: 10px;
          background-color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }
        .card-title {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
          color: #333;
          text-align: center;
        }
        .card-actions {
          display: flex;
          justify-content: center;
          margin-top: 16px;
          gap: 10px;
        }
        .action-button {
          display: flex;
          align-items: center;
          gap: 5px;
          background-color: #f5f5f5;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
        }
        .detail-button {
          background-color: #3b82f6;
          color: white;
        }
        .pdf-button {
          background-color: #10b981;
          color: white;
        }
        .edit-button {
          background-color: #14b8a6;
          color: white;
        }
        .delete-button {
          background-color: #d50000;
          color: white;
        }
        .detail-button:hover {
          background-color: #2563eb;
        }
        .pdf-button:hover {
          background-color: #059669;
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

export default SuratCard;