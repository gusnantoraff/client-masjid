import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { FaEdit, FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import fetchWithAuth from "@/utils/fetch";

export default function DetailJurnal({
    modalData,
    onClose,
    onSave,
    coaMap = {},
}) {
    const [editMode, setEditMode] = useState(false);
    const [rowData, setRowData] = useState(modalData.row || {});

    useEffect(() => {
        if (modalData.row) {
            setRowData(modalData.row);
        }
    }, [modalData]);

    const handleSave = async () => {
        try {
            // Perhitungan ulang sisa kas total
            const updatedSisaKas = rowData.pemasukan_total - rowData.pengeluaran_total;
    
            // Kirim permintaan PUT untuk memperbarui data arus kas
            const response = await fetchWithAuth(
                `https://backend-masjid-production.up.railway.app/arus-kas/${rowData.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        pemasukan_total: rowData.pemasukan_total,
                        pengeluaran_total: rowData.pengeluaran_total,
                        sisa_kas_total: updatedSisaKas,  // Menghitung ulang sisa kas
                        updated_at: new Date().toISOString(),  // Mengupdate waktu terakhir diperbarui
                    }),
                }
            );
    
            if (response.ok) {
                const updatedRow = await response.json();  // Mendapatkan data yang diperbarui dari respons
                onSave(updatedRow);  // Memperbarui data di parent
                setEditMode(false);  // Keluar dari mode edit
                onClose();  // Menutup modal
            } else {
                const errorData = await response.json();
                console.error("Failed to update data:", errorData);
                alert(`Gagal memperbarui data: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error updating data:", error);
            alert(`Terjadi kesalahan saat memperbarui data: ${error.message}`);
        }
    };
    

    return (
        <Dialog open={modalData.open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    fontFamily: "Satoshi",
                    fontWeight: "bold",
                    fontSize: "20px",
                }}
            >
                <div className="flex justify-between">
                    Detail Data
                    <div className="flex space-x-2">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="text-green-500"
                                >
                                    <FaCheck size={20} />
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="text-gray-500"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="text-yellow-500 flex items-center gap-2"
                                >
                                    <span>Edit</span>
                                    <FaEdit size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="text-red-500"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {/* Jenis */}
                    <div>
                        <label htmlFor="jenis">Jenis</label>
                        <input
                            id="jenis"
                            type="text"
                            value={rowData.name || ""}
                            readOnly={!editMode}
                            onChange={(e) =>
                                setRowData({ ...rowData, name: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: editMode ? "1px solid #ccc" : "none",
                                background: editMode ? "white" : "#f9f9f9",
                            }}
                        />
                    </div>

                    {/* Tanggal */}
                    <div>
                        <label htmlFor="tanggal">Tanggal</label>
                        <input
                            id="tanggal"
                            type="date"
                            value={rowData.date || ""}
                            readOnly={!editMode}
                            onChange={(e) =>
                                setRowData({ ...rowData, date: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: editMode ? "1px solid #ccc" : "none",
                                background: editMode ? "white" : "#f9f9f9",
                            }}
                        />
                    </div>

                    {/* Jumlah */}
                    <div>
                        <label htmlFor="jumlah">Jumlah</label>
                        <input
                            id="jumlah"
                            type="number"
                            value={rowData.amount || ""}
                            readOnly={!editMode}
                            onChange={(e) =>
                                setRowData({
                                    ...rowData,
                                    amount: parseFloat(e.target.value) || 0,
                                })
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: editMode ? "1px solid #ccc" : "none",
                                background: editMode ? "white" : "#f9f9f9",
                            }}
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label htmlFor="deskripsi">Deskripsi</label>
                        <textarea
                            id="deskripsi"
                            value={rowData.description || ""}
                            readOnly={!editMode}
                            onChange={(e) =>
                                setRowData({
                                    ...rowData,
                                    description: e.target.value,
                                })
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: editMode ? "1px solid #ccc" : "none",
                                background: editMode ? "white" : "#f9f9f9",
                                resize: "none",
                                height: "80px",
                            }}
                        />
                    </div>

                    {/* File */}
                    <div>
                        <label htmlFor="file">File</label>
                        <input
                            id="file"
                            type="text"
                            value={rowData.file || "No File"}
                            readOnly
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: "none",
                                background: "#f9f9f9",
                            }}
                        />
                    </div>

                    {/* COA */}
                    <div>
                        <label htmlFor="coa">Oleh (COA)</label>
                        <select
                            id="coa"
                            value={rowData.oleh || ""}
                            disabled={!editMode}
                            onChange={(e) =>
                                setRowData({ ...rowData, oleh: e.target.value })
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: editMode ? "1px solid #ccc" : "none",
                                background: editMode ? "white" : "#f9f9f9",
                            }}
                        >
                            <option value="">Pilih COA</option>
                            {Object.keys(coaMap).map((key) => (
                                <option key={key} value={key}>
                                    {coaMap[key]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={rowData.status || ""}
                            disabled={!editMode}
                            onChange={(e) =>
                                setRowData({
                                    ...rowData,
                                    status: e.target.value,
                                })
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: editMode ? "1px solid #ccc" : "none",
                                background: editMode ? "white" : "#f9f9f9",
                            }}
                        >
                            <option value="Pemasukan">Pemasukan</option>
                            <option value="Pengeluaran">Pengeluaran</option>
                        </select>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
