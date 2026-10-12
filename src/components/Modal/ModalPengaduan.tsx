import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: { nama_pengirim: string; email: string; pesan: string; tanggal: string };
  loading: boolean;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [namaPengirim, setNamaPengirim] = useState(initialData?.nama_pengirim || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [newMessage, setNewMessage] = useState(initialData?.pesan || "");
  const [tanggal, setTanggal] = useState(initialData?.tanggal || new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (initialData) {
      setNamaPengirim(initialData.nama_pengirim);
      setEmail(initialData.email);
      setNewMessage(initialData.pesan);
      setTanggal(initialData.tanggal);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nama_pengirim: namaPengirim, email, pesan: newMessage, tanggal });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? "Edit Pesan" : "Tambah Pesan"}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <label>Nama Pengirim</label>
            <input
              type="text"
              value={namaPengirim}
              onChange={(e) => setNamaPengirim(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Pesan</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label>Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Mengirim..." : initialData ? "Update Pesan" : "Kirim Pesan"}
          </button>
        </form>
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
          font-weight: 600;
        }
        .close-button {
          background-color: transparent;
          border: none;
          color: #ca0a37;
          cursor: pointer;
          font-size: 24px;
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
          background-color: #14b8a6;
        }
      `}</style>
    </div>
  );
};

export default ModalForm;
