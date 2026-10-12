"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { AiOutlineExport, AiOutlinePlus } from "react-icons/ai";
import Button from "@mui/material/Button";
import axios from "@/utils/axios";
import { SlActionUndo } from "react-icons/sl";
import { Checkbox } from "@mui/material";
import { Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Menu from "@mui/material/Menu";
import MenuItemMUI from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import Modal from "./DetailJurnal";

const TabelKeuangan = ({
    isLaporanPage,
    isPenerimaanPage,
    isPengeluaranPage,
    isArusKasPage,
}) => {
    // Data yang sudah difilter
    const [rows, setRows] = useState([]);
    const [coaMap, setCoaMap] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState({
        Pemasukan: [],
        Pengeluaran: [],
    });
    const [modalOpen, setModalOpen] = useState(false); // Modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]); // Menyimpan item yang dipilih untuk detail
    const [isEditing, setIsEditing] = useState(false); // Untuk mengontrol mode edit
    const [editedItem, setEditedItem] = useState(null); // Menyimpan item yang sedang diedit
    const [isRestore, setIsRestore] = useState(false); // Mengelola mode restore
    const [restoreItems, setRestoreItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const [anchorEl, setAnchorEl] = useState(null);

    const COAUrl = "/coa";

    const pageTitle = isLaporanPage
        ? "Laporan Keuangan"
        : isPenerimaanPage
          ? "Penerimaan"
          : isPengeluaranPage
            ? "Pengeluaran"
            : isArusKasPage
              ? "Jurnal Arus Kas"
              : "";

    const exportFileName = isLaporanPage
        ? "laporan_keuangan"
        : isPenerimaanPage
          ? "laporan_penerimaan"
          : isPengeluaranPage
            ? "laporan_pengeluaran"
            : "";

    const months = [
        { value: "01", label: "Januari" },
        { value: "02", label: "Februari" },
        { value: "03", label: "Maret" },
        { value: "04", label: "April" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Juni" },
        { value: "07", label: "Juli" },
        { value: "08", label: "Agustus" },
        { value: "09", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ];

    useEffect(() => {
        const fetchCoaData = async () => {
            try {
                setLoading(true);
                const coaurl = COAUrl;
                const response = await axios.get(coaurl);

                const coaMapping = {};
                response.data.forEach((coa) => {
                    coaMapping[coa.id] = {
                        nama_akun: coa.nama_akun,
                        tipe: coa.tipe,
                    };
                });

                setCoaMap(coaMapping); // Update coaMap state with fetched data
            } catch (error) {
                console.error("Error fetching COA data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoaData(); // Trigger fetch on component mount
    }, []);

    // Fetch data from Penerimaan Kas and Pengeluaran Kas
    useEffect(() => {
        const fetchKasData = async () => {
            if (Object.keys(coaMap).length === 0) {
                console.log("Waiting for COA data...");
                return; // If COA data is not available, wait
            }

            try {
                setLoading(true);

                // Fetch Penerimaan Kas
                const penerimaanKasUrl = isRestore
                    ? "/penerimaan-kas/deleted"
                    : "/penerimaan-kas";
                const penerimaanResponse = await axios.get(penerimaanKasUrl);

                console.log("Penerimaan Kas data:", penerimaanResponse.data);

                // Fetch Pengeluaran Kas
                const pengeluaranKasUrl = isRestore
                    ? "/pengeluaran-kas/deleted"
                    : "/pengeluaran-kas";
                const pengeluaranResponse = await axios.get(pengeluaranKasUrl);

                console.log("Pengeluaran Kas data:", pengeluaranResponse.data);

                // Process both data sets
                const penerimaanKas = penerimaanResponse.data.map(
                    (pemasukan) => ({
                        id: pemasukan.id,
                        name: pemasukan.jenis,
                        date: pemasukan.tanggal,
                        amount: parseFloat(pemasukan.jumlah),
                        tipe: coaMap[pemasukan.coa_id]?.tipe || "N/A",
                        description: pemasukan.deskripsi,
                        file: pemasukan.image || "No File",
                        oleh: coaMap[pemasukan.coa_id]?.nama_akun || "Unknown",
                        status: "Pemasukan",
                        deleted_status: pemasukan.deleted_status || 0,
                    }),
                );

                const pengeluaranKas = pengeluaranResponse.data.map(
                    (pengeluaran) => ({
                        id: pengeluaran.id,
                        name: pengeluaran.jenis,
                        date: pengeluaran.tanggal,
                        amount: -parseFloat(pengeluaran.jumlah),
                        tipe: coaMap[pengeluaran.coa_id]?.tipe || "N/A",
                        description: pengeluaran.deskripsi,
                        file: pengeluaran.image || "No File",
                        oleh:
                            coaMap[pengeluaran.coa_id]?.nama_akun || "Unknown",
                        status: "Pengeluaran",
                        deleted_status: pengeluaran.deleted_status || 0,
                    }),
                );

                // Filter out data with deleted_status 0 or 1
                const filteredPenerimaanKas = penerimaanKas.filter((item) =>
                    [0, 1].includes(item.deleted_status),
                );

                const filteredPengeluaranKas = pengeluaranKas.filter((item) =>
                    [0, 1].includes(item.deleted_status),
                );

                // Combine and set data
                const combinedData = [
                    ...filteredPenerimaanKas,
                    ...filteredPengeluaranKas,
                ];
                console.log("Combined Data:", combinedData);

                if (combinedData.length === 0) {
                    console.warn("No data matched the filter condition.");
                }

                setRows(combinedData); // Update state with filtered combined data
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchKasData(); // Trigger data fetch after COA is ready
    }, [coaMap, isRestore]);

    const [filteredRows, setFilteredRows] = useState([]); // State untuk menyimpan data yang sudah difilter
    const [startDate, setStartDate] = useState(null); // Tanggal mulai
    const [endDate, setEndDate] = useState(null); // Tanggal selesai
    const [statusFilter, setStatusFilter] = useState(""); // Status (Pemasukan/Pengeluaran)
    const [monthFilter, setMonthFilter] = useState(null); // Bulan

    const filterData = (
        data,
        startDate,
        endDate,
        statusFilter,
        monthFilter,
    ) => {
        return data.filter((item) => {
            // Filter berdasarkan tanggal
            const itemDate = new Date(item.date);
            const isDateInRange =
                (!startDate || itemDate >= new Date(startDate)) &&
                (!endDate || itemDate <= new Date(endDate));

            // Filter berdasarkan status (Pemasukan atau Pengeluaran)
            const isStatusMatch =
                !statusFilter || item.status.toLowerCase() === statusFilter;

            // Filter berdasarkan bulan (jika bulan diatur)
            const isMonthMatch =
                !monthFilter || itemDate.getMonth() + 1 === parseInt(monthFilter);

            return isDateInRange && isStatusMatch && isMonthMatch;
        });
    };

    useEffect(() => {
        if (rows.length > 0) {
            // Pastikan data sudah ada di rows sebelum memfilter
            const newFilteredRows = filterData(
                rows,
                startDate,
                endDate,
                statusFilter,
                monthFilter,
            );
            setFilteredRows(newFilteredRows);
        }
    }, [rows, startDate, endDate, statusFilter, monthFilter]); // Trigger efek ketika rows atau filter berubah

    const handleEdit = () => {
        setIsEditing(true); // Mengaktifkan mode edit
        setIsDetailModalOpen(true); // Membuka modal
    };

    const handleShowDetail = (item) => {
        setIsEditing(false);
        setSelectedItem(item); // Menyimpan item yang dipilih
        setIsDetailModalOpen(true); // Membuka modal
    };

    const handleSaveChanges = async () => {
        // Pastikan semua field terisi sebelum melanjutkan
        if (
            !selectedItem.name ||
            !selectedItem.date ||
            selectedItem.amount == null
        ) {
            console.error("Semua field wajib diisi.");
            alert("Semua field wajib diisi.");
            return;
        }

        try {
            setLoading(true);

            // Tentukan endpoint berdasarkan nilai `amount`
            const isPengeluaran = selectedItem.amount < 0; // Jika < 0 berarti pengeluaran
            const endpoint = isPengeluaran
                ? `/pengeluaran-kas/${selectedItem.id}`
                : `/penerimaan-kas/${selectedItem.id}`;
            console.log(selectedItem);
            // Pastikan `amount` selalu positif sebelum dikirim
            const payload = {
                ...selectedItem,
                jumlah: Math.abs(selectedItem.amount), // Konversi ke positif
                jenis: selectedItem.name,
                tanggal: selectedItem.date,
            };
            console.log("Payload yang dikirim:", payload);

            // Kirim data ke server dengan menggunakan axios
            const response = await axios.put(endpoint, payload);

            console.log(response);

            if (response.status === 200) {
                // Perbarui state rows setelah data berhasil disimpan
                setRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === selectedItem.id
                            ? { ...row, ...payload }
                            : row,
                    ),
                );

                alert("Perubahan berhasil disimpan!");
                setIsDetailModalOpen(false); // Tutup modal
            } else {
                alert("Gagal menyimpan perubahan, coba lagi.");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Gagal menyimpan perubahan. Periksa koneksi atau coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const displayedRows = useMemo(() => {
        const filteredRows = filterData(
            rows,
            startDate,
            endDate,
            statusFilter,
            monthFilter,
        );
        return filteredRows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        ); // Memotong data berdasarkan halaman
    }, [
        rows,
        page,
        rowsPerPage,
        startDate,
        endDate,
        statusFilter,
        monthFilter,
    ]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleExport = (format) => {
        if (!isArusKasPage) {
            if (format === "CSV") {
                const csvContent =
                    "data:text/csv;charset=utf-8," +
                    ["Jenis,Tanggal,Jumlah,Deskripsi,File,Oleh,Status"]
                        .concat(
                            filteredRows.map((row) =>
                                [
                                    row.name,
                                    row.date,
                                    row.amount.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }),
                                    row.description,
                                    row.file,
                                    row.oleh,
                                    row.status,
                                ].join(","),
                            ),
                        )
                        .join("\n");

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `${exportFileName}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (format === "PDF") {
                const doc = new jsPDF("p", "cm", "a4");
                const headers = [
                    "No",
                    "Jenis",
                    "Tanggal",
                    "Jumlah",
                    "Deskripsi",
                    "File",
                    "Oleh",
                    "Status",
                ];
                const tableData = filteredRows.map((row, index) => [
                    index + 1,
                    row.name,
                    row.date,
                    row.amount.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                    }),
                    row.description,
                    row.file,
                    row.oleh,
                    row.status,
                ]);
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text(pageTitle, 10.5, 1, { align: "center" });

                doc.autoTable({
                    head: [headers],
                    body: tableData,
                    startY: 2,
                    theme: "grid",
                });

                doc.save(`${exportFileName}.pdf`);
            }
        }

        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectId = (id, status) => {
        setSelectedIds((prevSelectedIds) => {
            const currentSelectedIds = prevSelectedIds[status] || [];

            if (currentSelectedIds.includes(id)) {
                // Jika ID sudah ada, hapus dari daftar terpilih
                return {
                    ...prevSelectedIds,
                    [status]: currentSelectedIds.filter((item) => item !== id),
                };
            } else {
                // Jika ID belum ada, tambahkan ke daftar terpilih
                return {
                    ...prevSelectedIds,
                    [status]: [...currentSelectedIds, id],
                };
            }
        });
    };

    const handleDelete = async () => {
        const selectedPemasukan = selectedIds.Pemasukan || [];
        const selectedPengeluaran = selectedIds.Pengeluaran || [];

        if (
            selectedPemasukan.length === 0 &&
            selectedPengeluaran.length === 0
        ) {
            setErrorMessage("Tidak ada data yang dipilih.");
            return;
        }

        try {
            // Hapus data Pemasukan
            for (const id of selectedPemasukan) {
                await axios.delete(`/penerimaan-kas/${id}`);
            }

            // Hapus data Pengeluaran
            for (const id of selectedPengeluaran) {
                await axios.delete(`/pengeluaran-kas/${id}`);
            }

            // Filter data yang sudah dihapus
            const updatedRows = rows.filter(
                (item) =>
                    !selectedPemasukan.includes(item.id) &&
                    !selectedPengeluaran.includes(item.id),
            );

            setRows(updatedRows);
            setSelectedIds({ Pemasukan: [], Pengeluaran: [] }); // Reset selectedIds setelah penghapusan
            setSuccessMessage("Data berhasil dihapus.");
            setIsDeleteModalOpen(false); // Menutup modal setelah berhasil
        } catch (error) {
            console.error("Error deleting data:", error);
            setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const closeAlert = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleRestoreSubmit = async () => {
        // Combine selected IDs from both Pemasukan and Pengeluaran
        const selectedPemasukan = selectedIds.Pemasukan || [];
        const selectedPengeluaran = selectedIds.Pengeluaran || [];

        // If there are no selected IDs for both, show error
        if (
            selectedPemasukan.length === 0 &&
            selectedPengeluaran.length === 0
        ) {
            setErrorMessage("Tidak ada data yang dipilih untuk dipulihkan.");
            return;
        }

        try {
            // Restoring selected Pemasukan
            for (const id of selectedPemasukan) {
                await axios.patch(`/penerimaan-kas/${id}/restore`);
            }

            // Restoring selected Pengeluaran
            for (const id of selectedPengeluaran) {
                await axios.patch(`/pengeluaran-kas/${id}/restore`);
            }

            // Reset selected IDs after restore
            setSelectedIds({ Pemasukan: [], Pengeluaran: [] });
            setIsRestore(false); // Exit restore mode
            setSuccessMessage("Data yang dipilih berhasil dipulihkan.");
        } catch (error) {
            console.error("Error restoring data:", error);
            setErrorMessage("Gagal memulihkan data. Silakan coba lagi.");
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
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

                <p className="mb-4 mt-2 px-2 text-center text-3xl font-bold text-black">
                    {pageTitle}
                </p>
                {/* Filters */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            paddingTop: "10px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "16px",
                                    paddingTop: "10px",
                                }}
                            >
                                <TextField
                                    label="Tanggal Mulai"
                                    type="date"
                                    size="small"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    label="Tanggal Akhir"
                                    type="date"
                                    size="small"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                {isArusKasPage && (
                                    <TextField
                                        select
                                        label="Status"
                                        size="small"
                                        value={status}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        style={{ minWidth: 120 }}
                                    >
                                        <MenuItem value="pemasukan">
                                            <ArrowDownwardIcon
                                                style={{
                                                    marginRight: "8px",
                                                    color: "green",
                                                }}
                                            />
                                            <span>Pemasukan</span>
                                        </MenuItem>
                                        <MenuItem value="pengeluaran">
                                            <ArrowUpwardIcon
                                                style={{
                                                    marginRight: "8px",
                                                    color: "red",
                                                }}
                                            />
                                            <span>Pengeluaran</span>
                                        </MenuItem>
                                    </TextField>
                                )}
                                {(isPenerimaanPage || isPengeluaranPage) && (
                                    <TextField
                                        select
                                        label="Pilih Bulan"
                                        size="small"
                                        value={monthFilter}
                                        onChange={(e) =>
                                            setMonthFilter(e.target.value)
                                        }
                                        style={{ minWidth: "150px" }}
                                    >
                                        <MenuItem value="">
                                            Semua Bulan
                                        </MenuItem>
                                        {months.map((month) => (
                                            <MenuItem
                                                key={month.value}
                                                value={month.value}
                                            >
                                                {month.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setStartDate("");
                                        setEndDate("");
                                        setStatusFilter("");
                                        setMonthFilter("");
                                    }}
                                >
                                    Reset Filter
                                </Button>

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
                                {!isArusKasPage && (
                                    <>
                                        <Button
                                            onClick={handleClick}
                                            variant="outlined"
                                            startIcon={<AiOutlineExport />}
                                            style={{
                                                color: "#008080", // Warna teks dan ikon hijau toska
                                                borderColor: "#008080", // Warna border hijau toska
                                            }}
                                        >
                                            Export
                                        </Button>
                                        <Menu
                                            id="export-menu"
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItemMUI
                                                onClick={() =>
                                                    handleExport("CSV")
                                                }
                                            >
                                                <ListItemIcon>
                                                    <GridOnIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary="Export to CSV" />
                                            </MenuItemMUI>
                                            <MenuItemMUI
                                                onClick={() =>
                                                    handleExport("PDF")
                                                }
                                            >
                                                <ListItemIcon>
                                                    <PictureAsPdfIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary="Export to PDF" />
                                            </MenuItemMUI>
                                        </Menu>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <table className="border-grey-200 min-w-full border bg-white dark:bg-dark-2 dark:text-slate-200">
                    <thead>
                        <tr>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Jenis
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Tanggal
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Jumlah
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Deskripsi
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Tipe
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                File
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Oleh
                            </th>
                            <th
                                className="border-b px-4 py-2 text-left dark:border-gray-dark"
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Status
                            </th>
                            <th className="border-b px-4 py-2 text-left dark:border-gray-dark">
                                {isRestore ? (
                                    <Checkbox
                                        checked={
                                            selectedIds.length ===
                                                rows.length && rows.length > 0
                                        }
                                        indeterminate={
                                            selectedIds.length > 0 &&
                                            selectedIds.length < rows.length
                                        }
                                        onChange={() => {}}
                                    />
                                ) : (
                                    "Aksi"
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedRows.map((item, index) => (
                            <tr
                                key={`${item.id}-${index}`}
                                className={`${
                                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } dark:bg-dark-3 dark:odd:bg-dark-2`}
                            >
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {item.name}{" "}
                                    {/* Displaying the "name" field */}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {new Date(item.date).toLocaleDateString()}
                                    {/* Formatting the date */}
                                </td>
                                <td
                                    className="border-b px-4 py-2 dark:border-gray-dark"
                                    style={{
                                        color:
                                            item.amount < 0 ? "red" : "green",
                                    }}
                                >
                                    {item.amount.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {item.description}{" "}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {item.tipe}{" "}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {item.file}{" "}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {item.oleh}{" "}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    {item.amount < 0 ? (
                                        <div
                                            style={{
                                                color: "red",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <ArrowUpwardIcon />
                                            <span>Pengeluaran</span>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                color: "green",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <ArrowDownwardIcon />
                                            <span>Pemasukan</span>
                                        </div>
                                    )}
                                </td>
                                <td className="border-b px-4 py-2 dark:border-gray-dark">
                                    <div className="flex justify-start gap-2">
                                        {isRestore ? (
                                            // Saat dalam mode restore, hanya tampilkan checkbox
                                            <Checkbox
                                                checked={
                                                    selectedIds[
                                                        item.status
                                                    ]?.includes(item.id) ||
                                                    false
                                                } // Use item.status to dynamically reference the correct array
                                                onChange={() =>
                                                    handleSelectId(
                                                        item.id,
                                                        item.status,
                                                    )
                                                }
                                                inputProps={{
                                                    "aria-label":
                                                        "Restore Checkbox",
                                                }}
                                            />
                                        ) : (
                                            // Saat tidak dalam mode restore, tampilkan tombol aksi
                                            <>
                                                <button
                                                    className="flex items-center text-blue-500"
                                                    onClick={() => {
                                                        handleShowDetail(item); // Memilih ID saat ikon mata diklik
                
                                                    }}
                                                >
                                                    <FaEye size={20} />
                                                </button>
                                                <button
                                                    className="flex items-center text-red-500"
                                                    onClick={() => {
                                                        handleSelectId(
                                                            item.id,
                                                            item.status,
                                                        ); // Memilih ID saat ikon mata diklik
                                                        setSelectedId(item.id); // Menyimpan ID untuk detail // Pilih ID item
                                                        setIsDeleteModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <FaTrash size={20} />
                                                </button>
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
                            sx={{
                                backgroundColor: "#14B8A6",
                                marginTop: "10px",
                            }}
                        >
                            Restore Pilihan
                        </Button>
                    </Box>
                )}

                <div className="flex items-center justify-end gap-2 py-2">
                    <span>Page {page + 1}</span>
                    <button
                        onClick={(event) => handleChangePage(event, page - 1)}
                        disabled={page === 0}
                        className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
                    >
                        <MdOutlineNavigateBefore />
                    </button>
                    <button
                        onClick={(event) => handleChangePage(event, page + 1)}
                        disabled={displayedRows.length < rowsPerPage}
                        className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
                    >
                        <MdOutlineNavigateNext />
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                item={selectedItem}
                isEditing={isEditing}
                onEdit={handleEdit}
                onChange={setSelectedItem}
                onSave={handleSaveChanges}
            />

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
        </>
    );
};

export default TabelKeuangan;
