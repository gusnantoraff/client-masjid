"use client";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "@mui/material/Button";
import fetchWithAuth from "@/utils/fetch";
import axios from "@/utils/axios";
import { SlActionUndo } from "react-icons/sl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";

const FasilitasMasjid = () => {
    const [fasilitas, setFasilitas] = useState([]);
    const [newNamaFasilitas, setNewNamaFasilitas] = useState("");
    const [newDeskripsi, setNewDeskripsi] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isRestore, setIsRestore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchUrl = "/fasilitas";

    useEffect(() => {
        fetchFasilitasMasjid();
    }, [isRestore]);

    const fetchFasilitasMasjid = async () => {
        try {
            setLoading(true);
            const url = isRestore ? `/fasilitas/deleted` : fetchUrl;
            const response = await axios.get(url);
            setFasilitas(response.data);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Error fetching data. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const addFasilitas = async () => {
        if (!newNamaFasilitas || !newDeskripsi) {
            setErrorMessage("Nama Fasilitas dan Deskripsi wajib diisi.");
            setShowAlert(true);
            return;
        }
    
        const newEntry = {
            info_masjid_id: 1,  // Pastikan info_masjid_id diisi sesuai dengan kebutuhan
            nama_fasilitas: newNamaFasilitas,
            deskripsi: newDeskripsi,
        };
    
        try {
            setLoading(true); // Tampilkan indikator loading saat proses
            const response = await axios.post("/fasilitas", newEntry); // Kirim data baru yang benar
          
            // Menambahkan data baru ke state fasilitas
            setFasilitas((prevFasilitas) => [
                ...prevFasilitas,
                response.data.fasilitas, // Pastikan format respons sesuai
            ]);
    
            // Reset form input setelah sukses menambahkan
            setNewNamaFasilitas("");
            setNewDeskripsi("");
            setIsModalOpen(false); // Menutup modal
            setShowAlert(false); // Menutup alert
            setSuccessMessage("Data berhasil ditambahkan.");
        } catch (error) {
            console.error("Error adding fasilitas:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "Terjadi kesalahan saat menambahkan data."
            );
            setShowAlert(true);
        } finally {
            setLoading(false); // Matikan indikator loading
        }
    };
    

      const restoreFasilitas = async (id) => {
        try {
            await axios.patch(`${fetchUrl}/${id}/restore`);
            fetchFasilitasMasjid();
            setSuccessMessage("Data berhasil dipulihkan.");
        } catch (error) {
            setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
        }
    };

    const handleDelete = async () => {
        if (selectedId !== null) {
            try {
                await axios.delete(`/fasilitas/${selectedId}`); // API delete
                setFasilitas(fasilitas.filter((item) => item.id !== selectedId)); // Perbarui tabel
                setSelectedId(null); // Reset ID setelah dihapus
                setSuccessMessage("Data berhasil dihapus.");
            } catch (error) {
                console.error("Error deleting data:", error);
                setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
            }
        }
      };

      const updateFasilitas = async (id) => {
        const updatedItem = fasilitas.find((item) => item.id === id);
    
        if (!updatedItem) return; // Pastikan item ditemukan
    
        try {
            setLoading(true); // Tampilkan indikator loading saat proses
    
            const response = await axios.put(`/fasilitas/${id}`, {
                nama_fasilitas: updatedItem.nama_fasilitas,
                deskripsi: updatedItem.deskripsi,
            });
    
            // Setelah update sukses, perbarui state fasilitas
            setFasilitas((prevFasilitas) =>
                prevFasilitas.map((item) =>
                    item.id === id ? { ...item, ...response.data.fasilitas } : item
                )
            );
    
            // Reset state editing setelah update
            setIsEditing(null);
            setSuccessMessage("Data berhasil diperbarui.");
        } catch (error) {
            console.error("Error updating data:", error);
            setErrorMessage("Gagal memperbarui data. Silakan coba lagi.");
        } finally {
            setLoading(false); // Matikan indikator loading
        }
    };
    

      const handleEditChange = (id, field, value) => {
        setFasilitas((prevFasilitas) =>
            prevFasilitas.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };
    

      const cancelDelete = () => {
        setIsDeleteModalOpen(false);
      };
      
      const closeAlert = () => {
        setErrorMessage("");
        setSuccessMessage("");
      };
      
      const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((item) => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
      };
      
      const handleSelectAll = () => {
        const allIds = struktur.map((item) => item.id); // Gunakan struktur untuk ID yang tampil di tabel
        if (selectedIds.length === allIds.length) {
            setSelectedIds([]); // Kosongkan jika semua sudah dipilih
        } else {
            setSelectedIds(allIds); // Pilih semua ID
        }
      };

      const handleRestoreSubmit = async () => {
        if (selectedIds.length === 0) {
            setErrorMessage("Tidak ada data yang dipilih untuk di-restore.");
            return;
        }
        try {
            await Promise.all(
                selectedIds.map((id) =>
                    axios.patch(`${fetchUrl}/${id}/restore`),
                ),
            );
            setSelectedIds([]);
            setIsRestore(false);
            fetchFasilitasMasjid();
            setSuccessMessage("Data yang dipilih berhasil dipulihkan.");
        } catch (error) {
            setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
        }
      };

    return (
        <div className="border-grey-500 mb-4 mt-4 rounded-lg border p-4 shadow-md dark:border-gray-dark dark:bg-gray-dark">
            <div className="mb-4 flex justify-between">
                <h1 className="text-heading-6 font-bold text-dark dark:text-white">
                    Fasilitas Masjid
                </h1>
                <div className="items-right">
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#FFB80D",
                        color: "white",
                        marginRight: "10px",
                    }}
                    startIcon={<SlActionUndo />}
                    onClick={() => setIsRestore(!isRestore)}
                >
                    {isRestore ? "Cancel Restore" : "Restore Data"}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        backgroundColor: "#14B8A6",
                        color: "white",
                        marginRight: "10px",
                    }}
                    startIcon={<AiOutlinePlus />}
                >
                    Tambah Data
                </Button>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 flex items-center justify-between rounded-lg bg-red-500 p-4 text-white">
                    {errorMessage}
                    <button
                        onClick={closeAlert}
                        className="text-white hover:text-gray-300"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}
            {successMessage && (
                <div className="mb-4 flex items-center justify-between rounded-lg bg-green-500 p-4 text-white">
                    {successMessage}
                    <button
                        onClick={closeAlert}
                        className="text-white hover:text-gray-300"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            <table className="border-grey-200 min-w-full border bg-white dark:bg-dark-2 dark:text-slate-200">
                <thead>
                    <tr>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            No
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            Nama Fasilitas
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            Deskripsi
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                        {isRestore ? (
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            fasilitas.length &&
                                        fasilitas.length > 0
                                    }
                                    indeterminate={
                                        selectedIds.length > 0 &&
                                        selectedIds.length < fasilitas.length
                                    }
                                    onChange={handleSelectAll}
                                />
                            ) : (
                                "Aksi"
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {fasilitas.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`${
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } dark:bg-dark-3 dark:odd:bg-dark-2`}
                        >
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                                {index + 1}
                            </td>
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                            {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.nama_fasilitas}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "nama_fasilitas",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.nama_fasilitas
                                )}
                            </td>
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                            {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.deskripsi}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "deskripsi",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.deskripsi
                                )}
                            </td>
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                            <div className="flex justify-start gap-2">
                                    {isRestore ? (
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                item.id,
                                            )}
                                            onChange={() =>
                                                handleSelect(item.id)
                                            }
                                        />
                                    ) : (
                                        <>
                                            {isEditing === item.id ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    updateFasilitas(item.id)
                                                }
                                                className="text-green-500"
                                            >
                                                <FaCheck size={20}/>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(null);
                                                }}
                                                className="text-gray-500"
                                            >
                                                <FaTimes size={20}/>
                                            </button>
                                        </>
                                    ) : (

                                        <>
                                                    <button
                                                        className="flex items-center text-yellow-500"
                                                        onClick={() =>
                                                            setIsEditing(
                                                                item.id,
                                                            )
                                                        }
                                                    >
                                                        <FaEdit size={20} />
                                                    </button>
                                                    <button
                                                        className="flex items-center text-red-500"
                                                        onClick={() => {
                                                            setSelectedId(
                                                                item.id,
                                                            ); // Pilih ID item
                                                            setIsDeleteModalOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <FaTrash size={20} />
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
              </td>
            </tr>
          ))}
                </tbody>
            </table>
            {isRestore && (
              <Box sx={{ marginTop: 2, textAlign: "right", padding: "0 10px 10px 0" }}>
                <Button
                    variant="contained"
                    onClick={handleRestoreSubmit}
                    disabled={selectedIds.length === 0}
                    sx={{ backgroundColor: "#14B8A6", marginTop: "10px" }}
                >
                    Restore Pilihan
                </Button>
                </Box>
            )}

{isDeleteModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg bg-white p-6">
                        <h3 className="text-lg font-bold">
                            Are you sure you want to delete this item?
                        </h3>
                        <div className="mt-4">
                            <button
                                onClick={handleDelete}
                                className="mr-2 rounded bg-red-500 px-4 py-2 text-white"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2">
            <h2 className="mb-4 text-xl font-bold">Tambah Rekening</h2>
            <input
              type="text"
              placeholder="Nama Fasilitas"
              value={newNamaFasilitas}
              onChange={(e) => setNewNamaFasilitas(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <input
              type="text"
              placeholder="Deskripsi"
              value={newDeskripsi}
              onChange={(e) => setNewDeskripsi(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-500 px-4 py-2 text-white">Batal</button>
              <button
                onClick={addFasilitas} className="rounded-lg bg-blue-500 px-4 py-2 text-white">Tambah</button>
            </div>
          </div>
        </div>
      )}
        </div>
    );
};

export default FasilitasMasjid;
