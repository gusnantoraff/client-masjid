"use client";

import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "@mui/material/Button";
import axios from "@/utils/axios";
import { SlActionUndo } from "react-icons/sl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";

const StrukturOrganisasiMasjid = () => {
    const [struktur, setStruktur] = useState([]);
    const [newStruktur, setNewStruktur] = useState([]);
    const [newJabatan, setNewJabatan] = useState("");
    const [newNama, setNewNama] = useState("");
    const [newKontak, setNewKontak] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [isRestore, setIsRestore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [fetchedData, setFetchedData] = useState<any[]>([]);

    const fetchUrl = "/struktur-organisasi";

    useEffect(() => {
        fetchStrukturOrganisasi();
    }, [isRestore]);

    const fetchStrukturOrganisasi = async () => {
        try {
            setLoading(true);
            const url = isRestore ? `/struktur-organisasi/deleted` : fetchUrl;
            const response = await axios.get(url);
            setStruktur(response.data);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "Error fetching data. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const addStruktur = async () => {
        if (!newJabatan || !newNama) {
            setErrorMessage("Jabatan and Nama are required fields.");
            return;
        }

        const newEntry = {
            info_masjid_id: 1,
            jabatan: newJabatan,
            nama: newNama,
            kontak: newKontak,
        };

        try {
            const response = await axios.post("/struktur-organisasi", newEntry);
            const { id, ...strukturData } = response.data.strukturOrganisasi;
            setStruktur([...struktur, { id, ...strukturData }]);
            setNewStruktur([...newStruktur, { id, ...strukturData }]);
            setNewJabatan("");
            setNewNama("");
            setNewKontak("");
            setIsModalOpen(false);
            setSuccessMessage("Data berhasil ditambahkan.");
        } catch (error) {
            console.error("Error adding struktur organisasi:", error);
            setErrorMessage("Error adding data. Please try again.");
        }
    };

    const restoreStruktur = async (id) => {
        try {
            await axios.patch(`${fetchUrl}/${id}/restore`);
            fetchStrukturOrganisasi();
            setSuccessMessage("Data berhasil dipulihkan.");
        } catch (error) {
            setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
        }
    };

    const handleEditChange = (id, field, value) => {
        setStruktur((prevStruktur) =>
            prevStruktur.map((item) =>
                item.id === id ? { ...item, [field]: value } : item,
            ),
        );
    };

    const handleDelete = async () => {
        if (selectedId !== null) {
            try {
                await axios.delete(`/struktur-organisasi/${selectedId}`); // API delete
                setStruktur(struktur.filter((item) => item.id !== selectedId)); // Perbarui tabel
                setSelectedId(null); // Reset ID setelah dihapus
                setSuccessMessage("Data berhasil dihapus.");
            } catch (error) {
                console.error("Error deleting data:", error);
                setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
            }
        }
    };

    const updateStruktur = async (id) => {
        const updatedItem = struktur.find((item) => item.id === id);
        try {
            await axios.put(`/struktur-organisasi/${id}`, updatedItem);
            setStruktur(
                struktur.map((item) => (item.id === id ? updatedItem : item)),
            );
            setIsEditing(null);
            setSuccessMessage("Data berhasil diperbarui.");
        } catch (error) {
            setErrorMessage("Gagal memperbarui data. Silakan coba lagi.");
        }
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
            fetchStrukturOrganisasi();
            setSuccessMessage("Data yang dipilih berhasil dipulihkan.");
        } catch (error) {
            setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
        }
    };

    return (
        <div className="border-grey-500 mb-4 mt-4 rounded-lg border p-4 shadow-md dark:border-gray-dark dark:bg-gray-dark">
            <div className="mb-4 flex justify-between">
                <h1 className="text-heading-6 font-bold text-dark dark:text-white">
                    Struktur Organisasi Masjid
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
            <table className="border-grey-200 min-w-full border bg-white">
                <thead>
                    <tr>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            No
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            Jabatan
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            Nama
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            Kontak
                        </th>
                        <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                            {isRestore ? (
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            struktur.length &&
                                        struktur.length > 0
                                    }
                                    indeterminate={
                                        selectedIds.length > 0 &&
                                        selectedIds.length < struktur.length
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
                    {struktur.map((item, index) => (
                        <tr
                            key={item.id}
                            className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} dark:bg-dark-3 dark:odd:bg-dark-2`}
                        >
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                                {index + 1}
                            </td>
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                                {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.jabatan}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "jabatan",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.jabatan
                                )}
                            </td>
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                                {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.nama}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "nama",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.nama
                                )}
                            </td>
                            <td className="border-b px-4 py-2 dark:border-gray-dark">
                                {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.kontak}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "kontak",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.kontak
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
                                                            updateStruktur(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-green-500"
                                                    >
                                                        <FaCheck size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(null);
                                                        }}
                                                        className="text-gray-500"
                                                    >
                                                        <FaTimes size={20} />
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
                <Box
                    sx={{
                        marginTop: 2,
                        textAlign: "right",
                        padding: "0 10px 10px 0",
                    }}
                >
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
            {/* Modal Delete */}
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
            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2">
                        <h2 className="mb-4 text-xl font-bold">
                            Tambah Struktur Organisasi
                        </h2>
                        <input
                            type="text"
                            placeholder="Jabatan"
                            value={newJabatan}
                            onChange={(e) => setNewJabatan(e.target.value)}
                            className="mb-4 w-full rounded-md border p-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nama"
                            value={newNama}
                            onChange={(e) => setNewNama(e.target.value)}
                            className="mb-4 w-full rounded-md border p-2"
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg bg-gray-500 px-4 py-2 text-white"
                            >
                                Batal
                            </button>
                            <button
                                onClick={addStruktur}
                                className="rounded-lg bg-blue-500 px-4 py-2 text-white"
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StrukturOrganisasiMasjid;
