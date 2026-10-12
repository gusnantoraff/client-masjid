import axios from '@/utils/axios';
import React, { useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import Image from 'next/image';

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    id: string;
}

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
    image: Image[];
}


const EditKegiatan: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, id }) => {
    const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null);
    const [formData, setFormData] = useState({
        nama_kegiatan: '',
        tanggal: '',
        lokasi: '',
        kategori: 'umum',
        keterangan: '',
        image: null as File | null,
    });

    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [fileError, setFileError] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/kegiatan/${id}`);
                    const data = response.data;

                    setFormData({
                        nama_kegiatan: data.nama_kegiatan,
                        tanggal: data.tanggal,
                        lokasi: data.lokasi,
                        kategori: data.kategori || 'umum',
                        keterangan: data.keterangan,
                        image: null,
                    });

                    const getFotoUrl = data.images.length > 0
                        ? `http://localhost:8000/storage/${data.images[0].image}`
                        : 'https://via.placeholder.com/300';

                    setFotoUrl(getFotoUrl);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [isOpen, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const file = e.target.files?.[0];
        const maxFileSize = 8 * 1024 * 1024;
        const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];

        if (file) {
            if (file.size > maxFileSize) {
                setFileError('Foto maks 8MB.');
                e.target.value = '';
                return;
            } else if (!allowedFormats.includes(file.type)) {
                setFileError('Format foto hanya diperbolehkan JPG, JPEG, dan PNG.');
                e.target.value = '';
                return;
            } else {
                setFileError('');
            }

            setFotoUrl(URL.createObjectURL(file));
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            image: file || null,
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (formData.image) {
                await handleFotoUpload(formData.image);
            }

            const formattedTanggal = formatTanggal(formData.tanggal);

            const data = {
                nama_kegiatan: formData.nama_kegiatan,
                tanggal: formattedTanggal,
                lokasi: formData.lokasi,
                kategori: formData.kategori,
                keterangan: formData.keterangan,
            };

            await axios.put(`/kegiatan/${id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            onClose();
            onSubmit();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };


    const handleFotoUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("foto", file);

        try {
            await axios.post(`/kegiatan/${id}/upload-foto`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error("Error uploading foto:", error);
        }
    };

    const formatTanggal = (tanggal: string): string => {
        const formatted = tanggal.includes('T') ? tanggal.replace('T', ' ') : tanggal;
        return formatted.split(':').slice(0, 2).join(':');
    };
    

    const handleImageClick = (src: string) => {
        setSelectedImage(src);
    };

    const handleClosePreview = () => {
        setSelectedImage(null);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Edit Kegiatan</h2>
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
                            <label htmlFor="nama_kegiatan">Nama Kegiatan:</label>
                            <input
                                type="text"
                                id="nama_kegiatan"
                                name="nama_kegiatan"
                                value={formData.nama_kegiatan}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="tanggal">Tanggal:</label>
                            <input
                                type="datetime-local"
                                id="tanggal"
                                name="tanggal"
                                value={formData.tanggal}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="lokasi">Lokasi:</label>
                            <input
                                type="text"
                                id="lokasi"
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="kategori">Kategori:</label>
                            <select
                                id="kategori"
                                name="kategori"
                                value={formData.kategori}
                                onChange={handleChange}
                            >
                                <option value="khatib">Khatib</option>
                                <option value="muazin">Muazin</option>
                                <option value="umum">Umum</option>
                                <option value="hari-besar">Hari Besar</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="keterangan">Keterangan:</label>
                            <textarea
                                id="keterangan"
                                name="keterangan"
                                value={formData.keterangan}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="foto">Foto:</label>
                            {fotoUrl && (
                                <div className="relative w-full h-48 mb-4">
                                    <Image
                                        src={fotoUrl}
                                        alt="Pratinjau Foto"
                                        layout="intrinsic"
                                        width={600}
                                        height={500}
                                        style={{
                                            marginBottom: '5px',
                                            cursor: 'pointer',
                                            objectFit: 'contain',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                        }}
                                        onClick={() => handleImageClick(fotoUrl)}
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                id="image"
                                name="foto"
                                accept="image/jpeg, image/jpg, image/png"
                                onChange={handleFileChange}
                            />
                            {fileError && <p style={{ color: "red" }}>{fileError}</p>}
                        </div>
                        <button type="submit" className="submit-button">Update</button>
                    </form>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleClosePreview}
                >
                    <div className="relative">
                        <div className="relative w-full h-[60vh]">
                            <Image
                                src={selectedImage}
                                alt="Selected Image"
                                layout="intrinsic"
                                width={600}
                                height={400}
                                className="object-contain rounded-lg"
                                style={{
                                    objectFit: 'contain',
                                    maxWidth: '100%', 
                                    maxHeight: '100%',
                                }}
                            />
                        </div>
                        <button
                            onClick={handleClosePreview}
                            className="absolute top-2 right-2 text-white text-2xl bg-red-600 w-9 h-9 flex items-center justify-center rounded-full"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

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
                    color: #CA0A37;
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

export default EditKegiatan;
