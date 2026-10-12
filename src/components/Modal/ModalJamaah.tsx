import React, { useState } from "react";
import { BiX } from "react-icons/bi";
import fetchWithAuth from "@/utils/fetch";

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    onSuccess: (message: string) => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState({
        nama: "",
        gender: "pria",
        birth: "",
        alamat: "",
        kontak: "",
        email: "",
        keterangan: "aktif",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "kontak" ? value.replace(/^\+62/, "") : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const responseData = await fetchWithAuth("https://backend-masjid-production.up.railway.app/jamaah", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            console.log("Response from API:", responseData);
            onSubmit();
            onClose();
            onSuccess("Jamaah berhasil ditambahkan!");
        } catch (error) {
            console.error("Error posting data:", error);
            onSuccess("Jamaah gagal ditambahkan!");
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Tambah Data Jamaah</h2>
                    <button
                        className="close-button"
                        onClick={onClose}
                        style={{
                            backgroundColor: "#d50000",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "4px 4px",
                            cursor: "pointer",
                        }}
                    >
                        <BiX size={20} />
                    </button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="nama">Nama:<span style={{ color: 'red' }}>*</span></label>
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
                            <label htmlFor="keterangan">Status:<span style={{ color: 'red' }}>*</span></label>
                            <select
                                id="keterangan"
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                required
                            >
                                <option value="aktif">Aktif</option>
                                <option value="pindah">Pindah</option>
                                <option value="wafat">Wafat</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="kontak">Kontak:<span style={{ color: 'red' }}>*</span></label>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        padding: "8px",
                                        background: "#f0f0f0",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        marginRight: "2px",
                                    }}
                                >
                                    +62
                                </span>
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
                        </div>

                        <div>
                            <label htmlFor="email">Email:<span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="yourname@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Form Alamat (Textarea) Mengambil Kolom Penuh */}
                        <div style={{ gridColumn: "span 2" }}>
                            <label htmlFor="alamat">Alamat:<span style={{ color: 'red' }}>*</span></label>
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
                                <p style={{ color: "red" }}>
                                    Alamat harus memiliki minimal 10 karakter.
                                </p>
                            )}
                        </div>

                        <button type="submit" className="submit-button">
                            Submit
                        </button>
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
                    font-weight: 600;
                }
                .close-button {
                    background-color: transparent;
                    border: none;
                    color: #ca0a37;
                    cursor: pointer;
                }
                .modal-body {
                    display: flex;
                    flex-direction: column;
                }
                form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }
                form div {
                    margin-bottom: 10px;
                }
                label {
                    margin-right: 10px;
                }
                input,
                select,
                textarea {
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
                    background-color: #14b8a6;
                }
            `}</style>
        </div>
    );
};

export default ModalForm;
