
"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect } from "react";
import { BiPlus, BiTrash, BiX } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface GaleriItem {
  id: number;
  image: string;
  keterangan: string;
  kategori: string;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_FORMATS = ["image/jpeg", "image/png"];

export default function GaleriPage() {
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([]);
  const [keterangan, setKeterangan] = useState("galeri");
  const [image, setImage] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Membentuk URL gambar dari path yang dikirim Laravel.
  const getImageUrl = (path: string) => {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const cleanPath = path.replace(/^\/+/, "");

    if (cleanPath.startsWith("storage/")) {
      return `${API_URL}/${cleanPath}`;
    }

    return `${API_URL}/storage/${cleanPath}`;
  };

  // Mengambil daftar gambar galeri.
  const fetchGaleri = async () => {
    setFetching(true);

    try {
      const response = await fetch(
        `${API_URL}/api/public/images?kategori=galeri`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat galeri (${response.status})`);
      }

      const data = await response.json();

      const items = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      setGaleriList(items);
    } catch (error) {
      console.error("Error fetching galeri:", error);
      toast.error("Gagal memuat galeri. Periksa koneksi API.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void fetchGaleri();
  }, []);

  // Membersihkan URL preview agar tidak menumpuk di memori.
  useEffect(() => {
    return () => {
      if (fotoUrl) URL.revokeObjectURL(fotoUrl);
    };
  }, [fotoUrl]);

  // Validasi file foto.
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    setFileError("");
    setImage(null);
    setFotoUrl(null);

    if (!file) return;

    if (!ALLOWED_FORMATS.includes(file.type)) {
      setFileError("Format foto hanya boleh JPG, JPEG, atau PNG.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("Ukuran foto maksimal 8 MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setFotoUrl(URL.createObjectURL(file));
  };

  // Upload foto ke Laravel.
  const handleFotoUpload = async (file: File) => {
    const formData = new FormData();

    // PENTING: backend Laravel memvalidasi field bernama "image".
    formData.append("image", file);
    formData.append("keterangan", keterangan.trim());
    formData.append("kategori", "galeri");

    const response = await fetch(`${API_URL}/api/public/images/galeri`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Upload gagal:", response.status, result);

      if (response.status === 422 && result?.errors) {
        const messages = Object.values(result.errors)
          .flat()
          .join(" ");

        throw new Error(messages || "Validasi upload gagal.");
      }

      throw new Error(
        result?.message ||
          `Gagal mengunggah foto (HTTP ${response.status}).`
      );
    }

    return result;
  };

  // Submit form galeri.
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    if (!image) {
      toast.error("Silakan pilih foto terlebih dahulu.");
      return;
    }

    if (!keterangan.trim()) {
      toast.error("Silakan isi keterangan foto.");
      return;
    }

    setLoading(true);

    try {
      await handleFotoUpload(image);

      toast.success("Gambar berhasil ditambahkan ke galeri!");

      setKeterangan("galeri");
      setImage(null);
      setFotoUrl(null);
      setFileError("");

      const fileInput = document.getElementById(
        "image"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";

      await fetchGaleri();
    } catch (error) {
      console.error("Error submit galeri:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal mengunggah foto galeri."
      );
    } finally {
      setLoading(false);
    }
  };

  // Hapus gambar.
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus gambar ini?"
    );

    if (!confirmed || deletingId !== null) return;

    setDeletingId(id);

    try {
      const response = await fetch(
        `${API_URL}/api/public/images/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Gagal menghapus gambar (HTTP ${response.status}).`
        );
      }

      toast.success("Gambar berhasil dihapus.");

      setGaleriList((prev) => prev.filter((item) => item.id !== id));

      if (selectedImage) setSelectedImage(null);
    } catch (error) {
      console.error("Error deleting image:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menghapus gambar."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DefaultLayout>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
      />

      {/* Form tambah galeri */}
      <div className="mb-8 rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
        <h2 className="mb-4 text-xl font-bold text-black dark:text-white">
          Tambah Galeri Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-white"
            >
              Foto:
            </label>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full rounded-lg border-2 border-gray-300 p-2 text-sm text-gray-700 outline-none focus:border-red-500 disabled:opacity-50 dark:border-gray-600 dark:bg-meta-4 dark:text-white"
            />

            {fileError && (
              <p className="mt-1 text-sm text-red-500">
                {fileError}
              </p>
            )}

            {fotoUrl && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-gray-500">
                  Pratinjau foto:
                </p>

                <img
                  src={fotoUrl}
                  alt="Pratinjau foto"
                  className="max-h-64 max-w-full rounded-lg object-contain"
                />
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              Format JPG, JPEG, PNG. Maksimal 8 MB.
            </p>
          </div>

          <div>
            <label
              htmlFor="keterangan"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-white"
            >
              Keterangan:
            </label>

            <input
              type="text"
              id="keterangan"
              name="keterangan"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Masukkan keterangan foto"
              required
              disabled={loading}
              className="w-full rounded-lg border-2 border-gray-300 p-2 text-sm text-gray-700 outline-none focus:border-red-500 disabled:opacity-50 dark:border-gray-600 dark:bg-meta-4 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-48 items-center justify-center gap-2 rounded-lg bg-red-500 p-3 text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BiPlus className="text-xl" />
              {loading ? "Mengunggah..." : "Simpan Galeri"}
            </button>
          </div>
        </form>
      </div>

      {/* Daftar galeri */}
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-bold text-black dark:text-white">
          Daftar Galeri
        </h3>

        {fetching ? (
          <p className="py-8 text-center text-gray-500">
            Memuat galeri...
          </p>
        ) : galeriList.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            Belum ada gambar di galeri.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {galeriList.map((item) => {
              const src = getImageUrl(item.image);

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-meta-4"
                >
                  <img
                    src={src}
                    alt={item.keterangan || "Foto galeri"}
                    loading="lazy"
                    className="h-48 w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setSelectedImage(src)}
                  />

                  <div className="flex items-center justify-between gap-2 bg-white p-3 dark:bg-boxdark">
                    <span className="break-words text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {item.keterangan}
                    </span>

                    <button
                      type="button"
                      onClick={() => void handleDelete(item.id)}
                      disabled={deletingId !== null}
                      className="shrink-0 p-1 text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                      title="Hapus gambar"
                      aria-label="Hapus gambar"
                    >
                      <BiTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal pratinjau gambar */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Pratinjau gambar"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />

            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-2xl text-white"
              aria-label="Tutup pratinjau"
            >
              <BiX size={24} />
            </button>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
