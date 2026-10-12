import fetchWithAuth from "@/utils/fetch";;
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
    nama: '',
    birth: '',
    gender: 'pria',
    alamat: '',
    keterangan: 'yatim',
    kontak: '',
    status: 'aktif',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement| HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:  name === 'kontak' ? value.replace(/^\+62/, '') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const responseData = await fetchWithAuth("https://backend-masjid-production.up.railway.app/yatim-dhuafa", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });
      
      console.log("Response from API:", responseData);
      onSubmit();
      onClose();
      onSuccess("Yatim Dhuafa berhasil ditambahkan!");
  } catch (error) {
      console.error("Error posting data:", error);
      onSuccess("Yatim Dhuafa gagal ditambahkan!");
  }
};

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Tambah Data Yatim/Piatu/Dhuafa</h2>
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
              <label htmlFor="nama">Nama: <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="birth">Tanggal Lahir: <span style={{ color: 'red' }}>*</span></label>
              <input
                type="date"
                id="birth"
                name="birth"
                value={formData.birth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="gender">Jenis Kelamin:<span style={{ color: 'red' }}>*</span></label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
              </select>
            </div>
            <div>
              <label htmlFor="alamat">Alamat: <span style={{ color: 'red' }}>*</span></label>
              <textarea
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                rows={2}
                minLength={10}
                required
              />
              {formData.alamat.length < 10 && (
                <p style={{ color: "red" }}>Alamat harus memiliki minimal 10 karakter.</p>
              )}
            </div>

            <div>
              <label htmlFor="keterangan">Keterangan:<span style={{ color: 'red' }}>*</span></label>
              <select
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                required
              >
                <option value="yatim">Yatim</option>
                <option value="piatu">Piatu</option>
                <option value="yatim piatu">Yatim Piatu</option>
                <option value="dhuafa">Dhuafa</option>
              </select>
            </div>

            <label htmlFor="kontak">Kontak: <span style={{ color: 'red' }}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ padding: '8px', background: '#f0f0f0', border: '1px solid #ccc',borderRadius:'4px',marginRight:'2px' }}>+62</span>
              <input
                type="number"
                id="kontak"
                name="kontak"
                value={formData.kontak}
                onChange={handleChange}
                style={{ flex: 1 }}
                required
              />
            </div>

            <div>
              <label htmlFor="status">Status:<span style={{ color: 'red' }}>*</span></label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="aktif">Aktif</option>
                <option value="pindah">Pindah</option>
                <option value="wafat">Wafat</option>
              </select>
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
          max-width: 400px;
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
          font-weight: 600; /* Semi-bold */
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
        .submit-button {
          padding: 6px 16px;
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