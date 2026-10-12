/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Search } from "lucide-react";
import { AiOutlineExport, AiOutlinePlus } from "react-icons/ai";
import Button from "@mui/material/Button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExportDialog from "@/components/filter/ExportGeneralLedger";
import axios from "@/utils/axios";

interface Coa {
    id: number;
    kode_akun: string;
    nama_akun: string;
    tipe: string;
    penerimaan_kas: Array<{
        id: number;
        coa_id: number;
        arus_kas_id: number;
        jenis: string;
        tanggal: string;
        jumlah: string;
        deskripsi: string;
    }>;
    pengeluaran_kas: Array<{
        id: number;
        coa_id: number;
        arus_kas_id: number;
        jenis: string;
        tanggal: string;
        jumlah: string;
        deskripsi: string;
    }>;
    general_ledgers: GeneralLedger[];
}

interface GeneralLedger {
    id: number;
    coa_id: number;
    tanggal: string;
    debit_total: string;
    kredit_total: string;
    created_at: string;
    updated_at: string;
    coa: Coa;
}

const GeneralLedger = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalKredit, setTotalKredit] = useState(0);
    const [totalNominal, setTotalNominal] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [selectedCoa, setSelectedCoa] = useState<number | string>(sessionStorage.getItem("selectedCoa") || "");
    const [dataDropdown, setDataDropdown] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fetchData = async () => {
        if (!selectedCoa) return;

        try {
            const response = await axios.get(`/coa?status=terproses&penerimaan_kas_status=terproses&pengeluaran_kas_status=terproses`);
            const data: Coa[] = response.data;

            const mappedTransactions = data.flatMap((coa) => {
                const penerimaanTransactions = (coa.penerimaan_kas || []).map((penerimaan) => ({
                    tanggal: penerimaan.tanggal,
                    tipe: coa.tipe,
                    kodeAkun: coa.kode_akun,
                    namaAkun: coa.nama_akun,
                    deskripsi: penerimaan.deskripsi,
                    debit: parseFloat(penerimaan.jumlah),
                    kredit: 0,
                }));

                const pengeluaranTransactions = (coa.pengeluaran_kas || []).map((pengeluaran) => ({
                    tanggal: pengeluaran.tanggal,
                    tipe: coa.tipe,
                    kodeAkun: coa.kode_akun,
                    namaAkun: coa.nama_akun,
                    deskripsi: pengeluaran.deskripsi,
                    debit: 0,
                    kredit: parseFloat(pengeluaran.jumlah),
                }));

                return [...penerimaanTransactions, ...pengeluaranTransactions];
            });

            const sortedTransactions = mappedTransactions.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

            const totalDebit = sortedTransactions.reduce((sum, trx) => sum + trx.debit, 0);
            const totalKredit = sortedTransactions.reduce((sum, trx) => sum + trx.kredit, 0);
            const totalNominal = totalDebit - totalKredit;

            setTransactions(sortedTransactions);
            setTotalDebit(totalDebit);
            setTotalKredit(totalKredit);
            setTotalNominal(totalNominal);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        if (selectedCoa) {
            fetchData();
        }
    }, [selectedCoa, isSubmitted]);

    useEffect(() => {
        const fetchNewData = async () => {
            try {
                const response = await axios.get("/coa");
                setDataDropdown(response.data);
            } catch (error) {
                console.error("Error fetching new data:", error);
            }
        };

        fetchNewData();
    }, []);

    const filteredTransactions = transactions.filter((trx) =>
        trx.namaAkun.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleModalClose = () => {
        setSelectedCoa("");
        setSelectedDate("");
        setIsModalOpen(false);
    };

    const handleCoaChange = (coaId: string) => {
        setSelectedCoa(Number(coaId));
        sessionStorage.setItem("selectedCoa", coaId);
    };

    const handleAddTransaction = async () => {
        if (!selectedCoa || !selectedDate) {
            alert("COA dan Tanggal wajib diisi.");
            return;
        }

        try {
            const response = await axios.post("/general-ledger", {
                coa_id: selectedCoa,
                tanggal: selectedDate,
            });

            if (response.status === 200) {
                alert("General Ledger berhasil ditambahkan!");
                setSelectedCoa("");
                setSelectedDate("");
                setIsModalOpen(false);
                setIsSubmitted(true);
                fetchData();
            }
        } catch (error) {
            console.error("Error adding General Ledger:", error);
            alert("Terjadi kesalahan saat menambahkan jurnal.");
        }
    };


    const exportToPDF = () => {
        const doc = new jsPDF("p", "cm", "a4");
        const imgData = "/images/BG.png";

        doc.addImage(
            imgData,
            "JPEG",
            0,
            0,
            doc.internal.pageSize.width,
            doc.internal.pageSize.height,
        );

        const headers = [
            "No.",
            "Kode Akun",
            "Tanggal",
            "Keterangan",
            "Debit",
            "Kredit",
        ];

        const tableData = filteredTransactions.map((trx, index) => [
            index + 1,
            trx.kodeAkun,
            trx.tanggal,
            trx.keterangan,
            parseFloat(trx.debit).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            }),
            parseFloat(trx.kredit).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            }),
        ]);

        const creationDate = new Date().toLocaleString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        doc.setTextColor("white");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(`${creationDate}`, 1, 1);

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor("white");
        const topRightText = "by Tercode.com";
        const marginRight = 1;
        const rightX = doc.internal.pageSize.width - marginRight;
        doc.text(topRightText, rightX, 1, { align: "right" });

        const mosqueName = "Nama Masjid";
        const period = `Periode:`;

        doc.setFont("helvetica", "bold");
        doc.setTextColor("white");
        doc.setFontSize(16);
        doc.text(`Buku Besar ${mosqueName}`, 10.5, 2, { align: "center" });
        doc.text(period, 10.5, 2.5, { align: "center" });

        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 3,
            theme: "striped",
        });

        doc.save("Buku_Besar_namamasjid_periode.pdf");
    };

    const exportToCSV = () => {
        const headers = [
            "No.",
            "Kode Akun",
            "Tanggal",
            "Keterangan",
            "Debit",
            "Kredit",
        ];

        const csvRows = filteredTransactions.map((trx, index) => [
            index + 1,
            trx.kodeAkun,
            trx.tanggal,
            trx.keterangan,
            parseFloat(trx.debit).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            }),
            parseFloat(trx.kredit).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
            }),
        ]);

        const metadata = [
            [
                "Tanggal Dibuat:",
                new Date().toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            ],
            ["Buku Besar", `Buku Besar ${"Nama Masjid"}`],
            ["Periode", `Periode:`],
            [],
        ];

        const csvContent =
            "data:text/csv;charset=utf-8," +
            metadata
                .concat([headers])
                .concat(csvRows)
                .map((row) => row.join(","))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Buku_Besar_namamasjid_periode.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <DefaultLayout>
            <h1 className="p-2 text-4xl font-bold text-black">
                General Ledger
            </h1>

            <div className="mt-2 rounded-lg border bg-white shadow-sm">
                <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Jurnal Umum
                        </h2>
                        <div className="flex space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari transaksi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="rounded-md border py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <Button
                                variant="outlined"
                                startIcon={<AiOutlineExport />}
                                onClick={() => setExportDialogOpen(true)}
                                style={{
                                    color: "#008080",
                                    borderColor: "#008080",
                                }}
                            >
                                Export
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setIsModalOpen(true)}
                                sx={{
                                    backgroundColor: "#14B8A6",
                                    color: "white",
                                }}
                                startIcon={<AiOutlinePlus />}
                            >
                                Tambah Jurnal
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th>Tanggal</th>
                                    <th>Tipe</th>
                                    <th>Kode Akun</th>
                                    <th>Nama Akun</th>
                                    <th>Deskripsi</th>
                                    <th>Debit</th>
                                    <th>Kredit</th>
                                    <th>Nominal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((trx, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td>{trx.tanggal}</td>
                                        <td>{trx.tipe}</td>
                                        <td>{trx.kodeAkun}</td>
                                        <td>{trx.namaAkun}</td>
                                        <td>{trx.deskripsi}</td>
                                        <td>
                                            {trx.debit.toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            })}
                                        </td>
                                        <td>
                                            {trx.kredit.toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            })}
                                        </td>
                                        <td>
                                            {(
                                                trx.debit + trx.kredit
                                            ).toLocaleString("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="font-bold">
                                    <td colSpan={5} className="text-right">
                                        Total
                                    </td>
                                    <td>
                                        {totalDebit.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </td>
                                    <td>
                                        {totalKredit.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </td>
                                    <td>
                                        {totalNominal.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {exportDialogOpen && (
                <ExportDialog
                    open={exportDialogOpen}
                    onClose={() => setExportDialogOpen(false)}
                    onExportPDF={exportToPDF}
                    onExportCSV={exportToCSV}
                />
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-4">
                        <h3 className="mb-4 text-xl font-semibold">
                            Tambah Jurnal
                        </h3>
                        {/* COA Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Tipe COA
                            </label>
                            <select
                                value={selectedCoa}
                                onChange={(e) => handleCoaChange(e.target.value)}
                                className="mt-2 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih Tipe COA</option>
                                {dataDropdown.map((coa) => (
                                    <option key={coa.id} value={coa.id}>
                                        {coa.tipe}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Tanggal
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="mt-2 block w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTransaction}
                            sx={{ marginRight: "5px" }}
                        >
                            Simpan
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleModalClose}
                        >
                            Batal
                        </Button>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default GeneralLedger;
