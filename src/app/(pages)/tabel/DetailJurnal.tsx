import axios from "@/utils/axios";
import fetchWithAuth from "@/utils/fetch";
import React from "react";
import { FaEdit } from "react-icons/fa";

interface Item {
    id: number;
    name: string;
    date: string;
    jumlah?: number;
    description?: string;
    tipe?: string;
    oleh?: string;
    file?: string;
}

interface ModalProps {
    isEditing: boolean;
    item: Item | null;
    onClose: () => void;
    onChange: (item: Item) => void;
    onEdit: () => void;
    setRows: React.Dispatch<React.SetStateAction<Item[]>>;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    item,
    isEditing,
    onEdit,
    onChange,
    onSave,
}) => {
    if (!isOpen) return null; // Jika modal tidak terbuka, tidak merender apapun

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {isEditing ? "Edit Data" : "Detail Data"}
                    </h2>
                    <button
                        className="text-gray-500 dark:text-gray-400 hover:text-red-500"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>
                {!isEditing ? (
                    <div>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Nama: </strong> {item?.name || "N/A"}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Tanggal: </strong>{" "}
                            {new Date(item?.date).toLocaleDateString() || "N/A"}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Jumlah: </strong>{" "}
                            {item?.jumlah?.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }) || "N/A"}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Deskripsi:</strong>{" "}
                            {item?.description}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Tipe:</strong>{" "}
                            {item?.tipe}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Oleh:</strong>{" "}
                            {item?.oleh}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            <strong>Status:</strong>{" "}
                            {item?.status}
                        </p>
                   
                        <div className="flex justify-end mt-4">
                            <button
                                className="flex items-center px-4 py-2 text-blue-500 hover:underline"
                                onClick={onEdit}
                            >
                                <FaEdit className="mr-2" />
                                Edit
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-gray-700 dark:text-gray-300"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={item?.name || ""}
                                onChange={(e) =>
                                    onChange({ ...item, name: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="date"
                                className="block text-gray-700 dark:text-gray-300"
                            >
                                Tanggal
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={item?.date || ""}
                                onChange={(e) =>
                                    onChange({ ...item, date: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="amount"
                                className="block text-gray-700 dark:text-gray-300"
                            >
                                Jumlah
                            </label>
                            <input
                                type="number"
                                id="amount"
                                value={item?.amount || ""}
                                onChange={(e) =>
                                    onChange({
                                        ...item,
                                        amount: parseFloat(e.target.value),
                                    })
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="amount"
                                className="block text-gray-700 dark:text-gray-300"
                            >
                                Deskripsi
                            </label>
                            <input
                                type="text"
                                value={item?.description || ""}
                                onChange={(e) =>
                                    onChange({ ...item, description: e.target.value })
                                }
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md dark:text-white dark:bg-gray-600"
                                onClick={onClose}
                            >
                                Batal
                            </button>
                            <button
                                onClick={onSave}
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Modal;
