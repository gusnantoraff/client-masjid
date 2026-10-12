"use client";

import React, { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Search, Plus } from "lucide-react";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "@mui/material/Button";
import { FaCheck, FaEye, FaTrash } from "react-icons/fa6";
import { FaEdit, FaTimes } from "react-icons/fa";
import { IoIosRadioButtonOn } from "react-icons/io";
import axios from "@/utils/axios";
import { SlActionUndo } from "react-icons/sl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";

const ChartOfAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [newNamaAkun, setNewNamaAkun] = useState("");
    const [newTipeAkun, setNewTipeAkun] = useState("");
    const [newKodeAkun, setNewKodeAkun] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isRestore, setIsRestore] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchCOAData = async () => {
        try {
            setLoading(true);
            const url = isRestore ? "/coa/deleted" : "/coa";
            const response = await axios.get(url);
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            setErrorMessage(
                error.response?.data?.message ||
                    "Error fetching data. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCOAData();
    }, [isRestore]);

    const addCOA = async () => {
        if (!newNamaAkun || !newTipeAkun || !newKodeAkun) {
            setErrorMessage("Semua field wajib diisi.");
            setShowAlert(true);
            return;
        }

        const newCOAData = {
            coa_id: 1,
            kode_akun: newKodeAkun,
            nama_akun: newNamaAkun,
            tipe: newTipeAkun,
        };

        try {
            setLoading(true); // Tampilkan indikator loading saat proses
            const response = await axios.post("/coa", newCOAData);
            setAccounts((prevAccount) => [
                ...prevAccount,
                response.data.coa, // Sesuaikan format dengan respons API
            ]);

            setNewNamaAkun("");
            setNewTipeAkun("");
            setIsModalOpen(false);
            setErrorMessage("");
            setShowAlert(false);
            setSuccessMessage("Data berhasil ditambahkan.");
        } catch (error) {
            console.error("Error adding coa:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "Terjadi kesalahan saat menambahkan data.",
            );
            setShowAlert(true);
        } finally {
            setLoading(false); // Matikan indikator loading
        }
    };

    const handleDelete = async () => {
        if (selectedId !== null) {
            try {
                await axios.delete(`/coa/${selectedId}`); // API delete
                setAccounts(accounts.filter((item) => item.id !== selectedId)); // Perbarui tabel
                setSelectedId(null); // Reset ID setelah dihapus
                setSuccessMessage("Data berhasil dihapus.");
            } catch (error) {
                console.error("Error deleting data:", error);
                setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
            }
        }
    };

    const handleEditChange = (id, field, value) => {
        setAccounts((prevAccount) =>
            prevAccount.map((item) =>
                item.id === id ? { ...item, [field]: value } : item,
            ),
        );
    };

    const updateCOA = async (id) => {
        const updatedItem = accounts.find((item) => item.id === id);

        try {
            const response = await axios.put(`/coa/${id}`, updatedItem);

            // Pastikan update data setelah berhasil merespon API
            setAccounts((prevAccount) =>
                prevAccount.map((item) =>
                    item.id === id
                        ? { ...item, ...response.data.updatedMubaligh }
                        : item,
                ),
            );

            setIsEditing(null);
            setSuccessMessage("Data berhasil diperbarui.");
        } catch (error) {
            console.error("Error updating data:", error);
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
        const allIds = accounts.map((item) => item.id); // Gunakan struktur untuk ID yang tampil di tabel
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
                    axios.patch(`coa/${id}/restore`),
                ),
            );
            setSelectedIds([]);
            setIsRestore(false);
            fetchCOAData();
            setSuccessMessage("Data yang dipilih berhasil dipulihkan.");
        } catch (error) {
            setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
        }
    };

    return (
        <DefaultLayout>
            <h1 className="p-2 text-4xl font-bold text-black">
                Chart of Accounts
            </h1>
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
            <div className="cols-span-1 mt-2 w-full rounded-xl border border-gray-300 px-2 py-2 shadow-md">
                <div className="rounded-lg bg-white shadow-1">
                    <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Daftar Akun
                            </h3>
                            <div className="flex space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Cari akun..."
                                        className="rounded-md border border-gray-300 py-2 pl-8 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
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
                                    {isRestore
                                        ? "Cancel Restore"
                                        : "Restore Data"}
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
                                    Tambah Akun
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Kode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Nama Akun
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Tipe
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            {isRestore ? (
                                                <Checkbox
                                                    checked={
                                                        selectedIds.length ===
                                                            accounts.length &&
                                                        accounts.length > 0
                                                    }
                                                    indeterminate={
                                                        selectedIds.length >
                                                            0 &&
                                                        selectedIds.length <
                                                            accounts.length
                                                    }
                                                    onChange={handleSelectAll}
                                                />
                                            ) : (
                                                "Aksi"
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {accounts.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-left text-sm font-medium text-gray-900">
                                            {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.kode_akun}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "kode_akun",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.kode_akun)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                                            {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.nama_akun}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "nama_akun",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.nama_akun)}</td>
                                            <td className="whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
                                            {isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.tipe}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "tipe",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.tipe)}</td>
                                            <td className="flex space-x-2 whitespace-nowrap px-6 py-4 text-left text-sm text-gray-500">
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
                                                updateCOA(item.id)
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
            <h2 className="mb-4 text-xl font-bold">Tambah Akun</h2>
            <input
              type="Number"
              placeholder="Kode Akun"
              value={newKodeAkun}
              onChange={(e) => setNewKodeAkun(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <input
              type="text"
              placeholder="Nama Akun"
              value={newNamaAkun}
              onChange={(e) => setNewNamaAkun(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <input
              type="text"
              placeholder="Tipe Akun"
              value={newTipeAkun}
              onChange={(e) => setNewTipeAkun(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-500 px-4 py-2 text-white">Batal</button>
              <button
                onClick={addCOA} className="rounded-lg bg-blue-500 px-4 py-2 text-white">Tambah</button>
            </div>
            </div>
          </div>
      )}
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ChartOfAccounts;
