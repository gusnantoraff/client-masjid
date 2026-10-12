"use client";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { AiOutlinePlus } from 'react-icons/ai';
import Button from '@mui/material/Button';
import axios from "@/utils/axios";
import { SlActionUndo } from "react-icons/sl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";

const MubalighMasjid = () => {
  const [mubalighData, setMubalighData] = useState([]);
  const [newNamaMubaligh, setNewNamaMubaligh] = useState('')
  const [newKontakMubaligh, setNewKontakMubaligh] = useState('')
  const [newAlamatMubaligh, setNewAlamatMubaligh] = useState('')
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [isRestore, setIsRestore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [fetchedData, setFetchedData] = useState<any[]>([]);

  const fetchUrl = "/mubaligh"

  useEffect(() => {
    fetchMubalighData();
  }, [isRestore]);

  const fetchMubalighData = async () => {
    try {
        setLoading(true);
        const url = isRestore ? `/mubaligh/deleted` : fetchUrl;
        const response = await axios.get(url);
        setMubalighData(response.data);
    } catch (error) {
        setErrorMessage(
            error.response?.data?.message ||
                "Error fetching data. Please try again.",
        );
    } finally {
        setLoading(false);
    }
};

  const addMubaligh = async () => {
    if (!newNamaMubaligh || !newKontakMubaligh) {
      setErrorMessage("Semua field wajib diisi.");
      setShowAlert(true);
      return;
    }

    const newMubalighData = {
      info_masjid_id: 1,
      nama: newNamaMubaligh,
      kontak: newKontakMubaligh,
      alamat: newAlamatMubaligh
    }

    try {
      setLoading(true); // Tampilkan indikator loading saat proses
      const response = await axios.post("/mubaligh", newMubalighData);
      setMubalighData((prevMubaligh) => [
        ...prevMubaligh,
        response.data.mubaligh, // Sesuaikan format dengan respons API
    ]);

      setNewNamaMubaligh("");
      setNewKontakMubaligh("");
      setNewAlamatMubaligh("");
      setIsModalOpen(false);
      setErrorMessage("");
      setShowAlert(false);
      setSuccessMessage("Data berhasil ditambahkan.");
  } catch (error) {
      console.error("Error adding mubaligh:", error);
      setErrorMessage(
          error.response?.data?.message ||
              "Terjadi kesalahan saat menambahkan data."
      );
      setShowAlert(true);
  } finally {
      setLoading(false); // Matikan indikator loading
  }
};

  const restoreMubaligh = async (id) => {
    try {
        await axios.patch(`${fetchUrl}/${id}/restore`);
        fetchMubalighData();
        setSuccessMessage("Data berhasil dipulihkan.");
    } catch (error) {
        setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
    }
};

const handleDelete = async () => {
  if (selectedId !== null) {
      try {
          await axios.delete(`/mubaligh/${selectedId}`); // API delete
          setMubalighData(mubalighData.filter((item) => item.id !== selectedId)); // Perbarui tabel
          setSelectedId(null); // Reset ID setelah dihapus
          setSuccessMessage("Data berhasil dihapus.");
      } catch (error) {
          console.error("Error deleting data:", error);
          setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
      }
  }
};

const handleEditChange = (id, field, value) => {
  setMubalighData((prevMubaligh) =>
      prevMubaligh.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
      )
  );
};

const updateMubaligh = async (id) => {
  const updatedItem = mubalighData.find((item) => item.id === id);

  try {
    const response = await axios.put(`/mubaligh/${id}`, updatedItem);

    // Pastikan update data setelah berhasil merespon API
    setMubalighData((prevMubaligh) =>
      prevMubaligh.map((item) =>
        item.id === id ? { ...item, ...response.data.updatedMubaligh } : item
      )
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
      fetchMubalighData();
      setSuccessMessage("Data yang dipilih berhasil dipulihkan.");
  } catch (error) {
      setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
  }
};

  return (
    <div className="border-grey-500 mb-4 mt-4 rounded-lg border p-4 shadow-md dark:border-gray-dark dark:bg-gray-dark">
      <div className="mb-4 flex justify-between">
                <h1 className="text-heading-6 font-bold text-dark dark:text-white">
                    Mubaligh Masjid
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
            <th className="border-b dark:border-gray-dark px-4 py-2 text-left">No</th>
            <th className="border-b dark:border-gray-dark px-4 py-2 text-left">Nama Mubaligh</th>
            <th className="border-b dark:border-gray-dark px-4 py-2 text-left">Kontak</th>
            <th className="border-b dark:border-gray-dark px-4 py-2 text-left">Alamat</th>
            <th className="border-b dark:border-gray-dark px-4 py-2 text-left">{isRestore ? (
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            mubalighData.length &&
                                        mubalighData.length > 0
                                    }
                                    indeterminate={
                                        selectedIds.length > 0 &&
                                        selectedIds.length < mubalighData.length
                                    }
                                    onChange={handleSelectAll}
                                />
                            ) : (
                                "Aksi"
                            )}</th>
          </tr>
        </thead>
        <tbody>
          {mubalighData.map((item, index) => (
            <tr key={item.id}
            className={`${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            } dark:bg-dark-3 dark:odd:bg-dark-2`}>
              <td className="border-b dark:border-gray-dark px-4 py-2">{index + 1}</td>
              <td className="border-b dark:border-gray-dark px-4 py-2">{isEditing === item.id ? (
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
                                    item.nama)}</td>
              <td className="border-b dark:border-gray-dark px-4 py-2">{isEditing === item.id ? (
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
                                    item.kontak)}</td>
              <td className="border-b dark:border-gray-dark px-4 py-2">{isEditing === item.id ? (
                                    <input
                                        type="text"
                                        value={item.alamat}
                                        onChange={(e) =>
                                            handleEditChange(
                                                item.id,
                                                "alamat",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border px-2 py-1"
                                    />
                                ) : (
                                    item.alamat)}</td>
              <td className="border-b dark:border-gray-dark px-4 py-2">
              <div className="flex space-x-2">
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
                                                    updateMubaligh(item.id)
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
            <h2 className="mb-4 text-xl font-bold">Tambah Mubaligh</h2>
            <input
              type="text"
              placeholder="Nama Mubaligh"
              value={newNamaMubaligh}
              onChange={(e) => setNewNamaMubaligh(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <input
              type="text"
              placeholder="Kontak Mubaligh"
              value={newKontakMubaligh}
              onChange={(e) => setNewKontakMubaligh(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <input
              type="text"
              placeholder="Alamat Mubaligh"
              value={newAlamatMubaligh}
              onChange={(e) => setNewAlamatMubaligh(e.target.value)}
              className="mb-4 w-full rounded-md border p-2"
              required
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg bg-gray-500 px-4 py-2 text-white">Batal</button>
              <button
                onClick={addMubaligh} className="rounded-lg bg-blue-500 px-4 py-2 text-white">Tambah</button>
            </div>
            </div>
          </div>
      )}

    </div>
  );
};

export default MubalighMasjid;
