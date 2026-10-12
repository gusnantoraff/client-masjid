import React, { useState, useEffect } from 'react';
import axios from '@/utils/axios';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    targetUrl: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, title, targetUrl }) => {
    const [jenis, setJenis] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [coaOptions, setCoaOptions] = useState<{ id: number; tipe: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coaId, setCoaId] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError(null);
            axios.get('/coa')
                .then((response) => {
                    setCoaOptions(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Failed to fetch COA options');
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value.replace(/[^0-9]/g, ''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('jenis', jenis);
        formData.append('tanggal', tanggal);
        formData.append('jumlah', amount);
        formData.append('deskripsi', description);
        formData.append('coa_id', coaId);
        formData.append('arus_kas_id', '1');
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await axios.post(targetUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200 || response.status === 201) {
                console.log('Data submitted successfully:', response.data);

                await axios.put('/arus-kas/1', {
                    pemasukan_total: jenis === 'Pemasukan' ? amount : 0,
                    pengeluaran_total: jenis === 'Pengeluaran' ? amount : 0,
                });

                onSubmit();
                onClose();
            }
        } catch (error) {
            console.error('Failed to submit:', error);
            setError('Failed to submit the data');
        }
    };



    const jenisOptions =
        title === "Tambah Pemasukan"
            ? [
                "Donasi Tunai",
                "Donasi Uang Digital",
                "Donasi Berbasis Program",
                "Donasi Khusus",
            ]
            : [
                "Pengeluaran Operasional",
                "Pengeluaran Kegiatan Keagamaan",
                "Pengeluaran Sosial",
                "Pengeluaran Pembangunan dan Renovasi",
                "Pengeluaran Dakwah dan Penyebaran",
                "Pengeluaran Musiman",
                "Pengeluaran Administrasi",
            ];

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="z-10 w-4/5 max-w-5xl rounded-lg bg-white p-4 shadow-lg">
                <h2 className="mb-4 text-xl font-bold">{title}</h2>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label>Jenis: <span className="text-red-500">*</span></label>
                            <select
                                value={jenis}
                                onChange={(e) => setJenis(e.target.value)}
                                className="h-12 w-full rounded-lg border p-2"
                                required
                            >
                                <option value="">Pilih Jenis</option>
                                {jenisOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-1/3">
                            <label>Tanggal: <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                                className="h-12 w-full rounded-lg border p-2"
                                required
                            />
                        </div>
                        <div className="w-1/3">
                            <label>Jumlah: <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={amount}
                                onChange={handleAmountChange}
                                className="h-12 w-full rounded-lg border p-2"
                                placeholder="Jumlah Rupiah"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label>Deskripsi: <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-12 w-full rounded-lg border p-2"
                                placeholder="Deskripsi"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label>File: {jenis === "Donasi Uang Digital" && <span className="text-red-500">*</span>}</label>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                className="h-12 w-full rounded-lg border p-2"
                                required={jenis === "Donasi Uang Digital"}
                            />
                        </div>
                    </div>
                    <div className="w-1/3">
                        <label>Tipe COA: <span className="text-red-500">*</span></label>
                        <select
                            className="h-12 w-full rounded-lg border p-2"
                            value={coaId}
                            onChange={(e) => setCoaId(e.target.value)}
                            required
                        >
                            <option value="">Pilih Tipe COA</option>
                            {loading && <option disabled>Loading COA options...</option>}
                            {error && <option disabled>{error}</option>}
                            {coaOptions.map((coa) => (
                                <option key={coa.id} value={coa.id}>
                                    {coa.tipe}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="rounded-lg bg-gray-300 px-4 py-2">
                            Batal
                        </button>
                        <button type="submit" onClick={handleSubmit} className="rounded-lg bg-green-500 text-white px-4 py-2">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default Modal;
