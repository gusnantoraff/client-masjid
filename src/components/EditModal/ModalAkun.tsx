import axios from '@/utils/axios';
import React, { useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    id: string;
}

const EditAkun: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, id }) => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        birth: '',
        gender: 'Male',
        role: 'ADMIN',
    
  });


  useEffect(() => {
    if (isOpen && id) {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/users/${id}`);
                const data = response.data;

                // Setel data kegiatan ke formData dan set foto URL untuk pratinjau
                setFormData({
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    birth: data.birth,
                    gender: data.gender || 'Male',
                    role: data.role || 'ADMIN',
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }
}, [isOpen, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        birth: formData.birth,
        gender: formData.gender,
        role: formData.role,
    };

    try {
        await axios.put(`/users/${id}`, data);
        onClose();
        onSubmit(); 
    } catch (error) {
        console.error('Error updating data:', error);
    }
};

if (!isOpen) {
    return null;
}

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Pengaturan Akun</h2>
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
          <form onSubmit={handleUpdate}>
            <div>
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Kontak:</label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="birth">Tanggal Lahir:</label>
              <input
                type="date"
                id="birth"
                name="birth"
                value={formData.birth}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ADMIN">Admin</option>
                <option value="PENGURUS_MASJID">Pengurus Masjid</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Update</button>
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

export default EditAkun;