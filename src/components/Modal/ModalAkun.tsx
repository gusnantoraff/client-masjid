import axios from '@/utils/axios';
import React, { useState } from 'react';
import { BiX } from 'react-icons/bi';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    birth: "",
    password: "",
    password_confirmation: "",
    gender: "Male",
    role: "ADMIN",
    avatar: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users', formData);
      console.log('Response from API:', response.data);

      onClose();
      onSuccess("Akun berhasil ditambahkan!");
    } catch (error) {
      console.error('Error posting data:', error);
      onSuccess("Akun gagal ditambahkan!");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Tambah Users</h2>
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
              <label htmlFor="firstname">First Name:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Kontak:<span style={{ color: 'red' }}>*</span></label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="birth">Tanggal Lahir:<span style={{ color: 'red' }}>*</span></label>
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
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password_confirmation">Konfirmasi Password:</label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:<span style={{ color: 'red' }}>*</span></label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="role">Role:<span style={{ color: 'red' }}>*</span></label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="ADMIN">Admin</option>
                <option value="PENGURUS_MASJID">Pengurus Masjid</option>
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
          max-width: 700px;
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
        form {
          display: grid;
          grid-template-columns: 1fr 1fr; /* Membuat dua kolom */
          gap: 15px; /* Jarak antar elemen */
        }
        form div {
          margin-bottom: 10px;
        }
        label {
          margin-right: 10px;
        }
        input, select {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
        }
        .submit-button {
          grid-column: span 2;
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