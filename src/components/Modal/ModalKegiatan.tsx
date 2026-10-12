"use client";
import axios from '@/utils/axios';
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onSuccess: (message: string) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, onSuccess }) => {
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    tanggal: '',
    lokasi: '',
    kategori: 'umum',
    keterangan: '',
    foto: null as File | null,
  });

  const [fileError, setFileError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxFileSize = 8 * 1024 * 1024; // 8MB in bytes
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file) {
      if (file.size > maxFileSize) {
        setFileError('Foto maks 8MB.');
        e.target.value = ''; // Reset input
        return;
      } else if (!allowedFormats.includes(file.type)) {
        setFileError('Format foto hanya diperbolehkan JPG, JPEG, dan PNG.');
        e.target.value = ''; // Reset input
        return;
      } else {
        setFileError(''); // Clear error if file is valid
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      foto: file || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    data.append('nama_kegiatan', formData.nama_kegiatan);
    data.append('tanggal', formData.tanggal.replace('T', ' '));
    data.append('lokasi', formData.lokasi);
    data.append('kategori', formData.kategori);
    data.append('keterangan', formData.keterangan);

    if (formData.foto) {
      data.append('foto', formData.foto);
    }

    try {
      const response = await axios.post('/kegiatan', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from API:', response.data);
      onClose();
      onSubmit();
      onSuccess("Kegiatan berhasil ditambahkan!");
    } catch (error) {
      console.error('Error posting data:', error);
      onSuccess("Kegiatan gagal ditambahkan!");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Tambah Kegiatan</h2>
          <button
            className="close-button"
            onClick={onClose}
            style={{
              backgroundColor: '#d50000',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '4px 4px',
              cursor: 'pointer',
            }}
          >
            <BiX size={20} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nama_kegiatan">Nama Kegiatan:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                id="nama_kegiatan"
                name="nama_kegiatan"
                value={formData.nama_kegiatan}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="tanggal">Tanggal:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="datetime-local"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lokasi">Lokasi:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                id="lokasi"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="kategori">Kategori:<span style={{ color: 'red' }}>*</span></label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
              >
                <option value="khatib">Khatib</option>
                <option value="muazin">Muazin</option>
                <option value="umum">Umum</option>
                <option value="hari-besar">Hari Besar</option>

              </select>
            </div>
            <div>
              <label htmlFor="keterangan">Keterangan:<span style={{ color: 'red' }}>*</span></label>
              <textarea
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            <div>
              <label htmlFor="foto">Foto:</label>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileChange}
              />
              {fileError && <p style={{ color: "red" }}>{fileError}</p>} {/* Error message for file */}
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-title {
          color: black;
          font-weight: 600;
        }
        .close-button {
          background-color: transparent;
          border: none;
          color: #CA0A37;
          cursor: pointer;
        }
        .modal-body {
          display: flex;
          flex-direction: column;
        }
        form div {
          margin-bottom: 10px;
        }
        label {
          margin-right: 10px;
        }
        input, select, textarea {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }
        .error-message {
          color: #d50000;
          font-size: 0.875rem;
          margin-top: 4px;
        }
        .submit-button {
          padding: 8px 16px;
          background-color: #d50000;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #14B8A6;
        }
      `}</style>
    </div>
  );
};

export default ModalForm;
