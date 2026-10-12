"use client";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";
import Menu from "@mui/material/Menu";
import MenuItemMUI from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { AiOutlineExport } from "react-icons/ai";
import { jsPDF } from "jspdf";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { FaEye, FaTrash } from "react-icons/fa6";
import axios from "@/utils/axios";

export default function AccessibleTable({
    isLaporanPage,
    isPenerimaanPage,
    isPengeluaranPage,
    isArusKasPage,
}) {
    const [rows, setRows] = useState([]);
    const [coaMap, setCoaMap] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(""); // Filter bulan
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null); // Row for modal
    const [modalOpen, setModalOpen] = useState(false); // Modal state
    const [editMode, setEditMode] = useState(false);
    const [isRestore, setIsRestore] = useState(false); // Mengelola mode restore
    const [restoreItems, setRestoreItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const COAUrl = "/coa";
    const ArusKasUrl = "/arus-kas";

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
                const coaurl = isRestore ? `/coa/deleted` : COAUrl;
                const response = await axios.get(coaurl);
                const coaMapping = {};
                response.data.forEach((coa) => {
                    coaMapping[coa.id] = { nama: coa.nama_akun, tipe: coa.tipe };
                });
                setCoaMap(coaMapping);
            } catch (error) {
                console.error("Error fetching COA data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                const aruskasurl = isRestore ? `/arus-kas/deleted` : ArusKasUrl;
                const response = await axios.get(aruskasurl);

                const formattedRows = [];
                if (isLaporanPage) {
                    response.data.forEach((item) => {
                        formattedRows.push({
                            id: item.id,
                            name: item.jenis,
                            date: item.tanggal,
                            amount: parseFloat(item.jumlah),
                            tipe: coaMap[item.coa_id]?.tipe || "N/A",
                            description: item.deskripsi,
                            file: item.image || "No File",
                            oleh: coaMap[item.coa_id]?.nama || "Unknown",
                            status: item.status || "N/A",
                        });
                    });
                } else {
                    response.data.forEach((item) => {
                        item.penerimaan_kas.forEach((pemasukan) => {
                            formattedRows.push({
                                id: pemasukan.id,
                                name: pemasukan.jenis,
                                date: pemasukan.tanggal,
                                amount: parseFloat(pemasukan.jumlah),
                                tipe: coaMap[pemasukan.coa_id]?.tipe || "N/A",
                                description: pemasukan.deskripsi,
                                file: pemasukan.image || "No File",
                                oleh: coaMap[pemasukan.coa_id]?.nama || "Unknown",
                                status: "Pemasukan",
                            });
                        });

                        item.pengeluaran_kas.forEach((pengeluaran) => {
                            formattedRows.push({
                                id: pengeluaran.id,
                                name: pengeluaran.jenis,
                                date: pengeluaran.tanggal,
                                amount: -parseFloat(pengeluaran.jumlah),
                                tipe: coaMap[pengeluaran.coa_id]?.tipe || "N/A",
                                description: pengeluaran.deskripsi,
                                file: pengeluaran.image || "No File",
                                oleh: coaMap[pengeluaran.coa_id]?.nama || "Unknown",
                                status: "Pengeluaran",
                            });
                        });
                    });
                }

                setRows(formattedRows);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoaData();
        fetchData();
    }, [isRestore]);

    const mappedRows = rows.map((row) => ({
        ...row,
        oleh: coaMap[row.oleh] || row.oleh,
    }));

    const filteredRows = mappedRows.filter((row) => {
        const rowDate = new Date(row.date); // Ubah string menjadi Date object
        const start = startDate ? new Date(startDate) : null; // Pastikan startDate menjadi Date object
        const end = endDate ? new Date(endDate) : null; // Pastikan endDate menjadi Date object

        // Mengatur kondisi untuk rentang tanggal
        const isDateInRange =
            (!start || rowDate >= start) && (!end || rowDate <= end);

        // Memeriksa apakah bulan yang dipilih sesuai
        const isMonthMatch =
            !selectedMonth ||
            rowDate.getMonth() + 1 === parseInt(selectedMonth); // +1 karena getMonth() mengembalikan 0 untuk Januari

        const isStatusMatch =
            (isLaporanPage ||
                isArusKasPage ||
                (isPenerimaanPage && row.status === "Pemasukan") ||
                (isPengeluaranPage && row.status === "Pengeluaran")) &&
            (!status ||
                (status === "pemasukan" && row.status === "Pemasukan") ||
                (status === "pengeluaran" && row.status === "Pengeluaran"));

        return isDateInRange && isMonthMatch && isStatusMatch;
    });

    const displayedRows = mappedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                                    row.amount,
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

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsConfirmModalOpen(true);
    };
    
    const confirmBulkDelete = async () => {
        try {
            setLoading(true);
            const deletePromises = selectedIds.map(item => {
                const url = item.tipe === "coa" ? `/coa/${item.id}` : `/arus-kas/${item.id}`;
                return axios.delete(url);
            });
    
            await Promise.all(deletePromises);
    
            const deletedCoaIds = selectedIds.filter(item => item.tipe === "coa").map(item => item.id);
            const deletedArusKasIds = selectedIds.filter(item => item.tipe === "arus-kas").map(item => item.id);
    
            if (deletedCoaIds.length > 0) {
                setCoaMap(prev => {
                    const updated = { ...prev };
                    deletedCoaIds.forEach(id => {
                        delete updated[id];
                    });
                    return updated;
                });
            }
    
            if (deletedArusKasIds.length > 0) {
                setRows(prevRows => prevRows.filter(row => !deletedArusKasIds.includes(row.id)));
            }
    
            setSelectedIds([]);
            setSuccessMessage("Data berhasil dihapus.");
            setIsConfirmModalOpen(false);
        } catch (error) {
            console.error("Error deleting data:", error);
            setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
            setIsConfirmModalOpen(false);
        } finally {
            setLoading(false);
        }
    };
    
    const cancelBulkDelete = () => {
        setIsConfirmModalOpen(false);
    };

    const handleRowAction = (action, row) => {
        if (action === "view") {
            setModalData({ open: true, row });
        } else if (action === "delete") {
            const type = row.type; // Pastikan setiap row memiliki properti `type`
            handleDelete(row.id, type);
        }
    };

    const handleDelete = async (id, type) => {
        if (!id || !type) return;

        const url = type === "coa" ? `/coa/${id}` : `/arus-kas/${id}`;

        try {
            setLoading(true);
            await axios.delete(url);

            if (type === "coa") {
                setCoaMap(prev => {
                    const updated = { ...prev };
                    delete updated[id];
                    return updated;
                });
                setRows(prevRows => prevRows.filter(row => row.oleh !== id));
            } else if (type === "arus-kas") {
                setRows(prevRows => prevRows.filter(row => row.id !== id));
            }

            setSuccessMessage("Data berhasil dihapus.");
        } catch (error) {
            console.error("Error deleting data:", error);
            setErrorMessage("Gagal menghapus data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDetail = (row) => {
        setSelectedRow(row);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
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
                    style={{ display: "flex", gap: "16px", paddingTop: "10px" }}
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
                                onChange={(e) => setStartDate(e.target.value)}
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
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ minWidth: 120 }}
                                >
                                    <MenuItem value="">
                                        <span>Semua</span>
                                    </MenuItem>
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
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        setSelectedMonth(e.target.value)
                                    }
                                    style={{ minWidth: "150px" }}
                                >
                                    <MenuItem value="">Semua Bulan</MenuItem>
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
                                    setStatus("");
                                }}
                            >
                                Reset Filter
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
                                            onClick={() => handleExport("CSV")}
                                        >
                                            <ListItemIcon>
                                                <GridOnIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary="Export to CSV" />
                                        </MenuItemMUI>
                                        <MenuItemMUI
                                            onClick={() => handleExport("PDF")}
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
            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Jenis
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Tanggal
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Jumlah
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Deskripsi
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                File
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Oleh
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Status
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontFamily: "Satoshi",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Aksi
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.date}</TableCell>
                                <TableCell
                                    style={{
                                        color: row.amount < 0 ? "red" : "green",
                                    }}
                                >
                                    {row.amount.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    })}
                                </TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "10px",
                                    }}
                                >
                                    {row.file}
                                </TableCell>
                                <TableCell>{row.oleh}</TableCell>
                                <TableCell>
                                    {row.amount < 0 ? (
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
                                </TableCell>
                                <TableCell className="space-x-2">
                                    <button
                                        onClick={() => handleDetail(row)}
                                        className="text-blue-500"
                                    >
                                        <FaEye size={20} />
                                    </button>
                                    <button
                                        onClick={handleBulkDelete}
                                        className="text-red-500"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* Pagination */}
            <TablePagination
                component="div"
                count={mappedRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* Modal for Detail */}
            {selectedRow && (
                <Dialog open={modalOpen} onClose={handleModalClose}>
                    <DialogTitle>Detail Data</DialogTitle>
                    <DialogContent>
                        {editMode ? (
                            // Edit Mode
                            <>
                                <TextField
                                    label="Jenis"
                                    value={selectedRow.name}
                                    fullWidth
                                    margin="dense"
                                    select
                                    onChange={(e) =>
                                        setSelectedRow((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                >
                                    <MenuItem value="Jenis A">Jenis A</MenuItem>
                                    <MenuItem value="Jenis B">Jenis B</MenuItem>
                                    <MenuItem value="Jenis C">Jenis C</MenuItem>
                                </TextField>
                                <TextField
                                    label="Tanggal"
                                    value={selectedRow.date}
                                    type="date"
                                    fullWidth
                                    margin="dense"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) =>
                                        setSelectedRow((prev) => ({
                                            ...prev,
                                            date: e.target.value,
                                        }))
                                    }
                                />
                                <TextField
                                    label="Jumlah"
                                    value={selectedRow.amount}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) =>
                                        setSelectedRow((prev) => ({
                                            ...prev,
                                            amount: parseFloat(e.target.value),
                                        }))
                                    }
                                />
                                <TextField
                                    label="Deskripsi"
                                    value={selectedRow.description}
                                    fullWidth
                                    margin="dense"
                                    onChange={(e) =>
                                        setSelectedRow((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                                <TextField
                                    label="File"
                                    value={selectedRow.file}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Oleh"
                                    value={selectedRow.oleh}
                                    fullWidth
                                    margin="dense"
                                    select
                                    onChange={(e) =>
                                        setSelectedRow((prev) => ({
                                            ...prev,
                                            oleh: e.target.value,
                                        }))
                                    }
                                >
                                    {Object.keys(coaMap).map((key) => (
                                        <MenuItem key={key} value={coaMap[key]}>
                                            {coaMap[key]}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Status"
                                    value={selectedRow.status}
                                    fullWidth
                                    margin="dense"
                                    select
                                    onChange={(e) =>
                                        setSelectedRow((prev) => ({
                                            ...prev,
                                            status: e.target.value,
                                        }))
                                    }
                                >
                                    <MenuItem value="Pemasukan">
                                        Pemasukan
                                    </MenuItem>
                                    <MenuItem value="Pengeluaran">
                                        Pengeluaran
                                    </MenuItem>
                                </TextField>
                            </>
                        ) : (
                            // View Mode
                            <>
                                <TextField
                                    label="Jenis"
                                    value={selectedRow.name}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Tanggal"
                                    value={selectedRow.date}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Jumlah"
                                    value={selectedRow.amount.toLocaleString(
                                        "id-ID",
                                        {
                                            style: "currency",
                                            currency: "IDR",
                                        },
                                    )}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Deskripsi"
                                    value={selectedRow.description}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="File"
                                    value={selectedRow.file}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Oleh"
                                    value={selectedRow.oleh}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                                <TextField
                                    label="Status"
                                    value={selectedRow.status}
                                    fullWidth
                                    margin="dense"
                                    InputProps={{ readOnly: true }}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        {editMode ? (
                            <>
                                <Button
                                    onClick={async () => {
                                        try {
                                            await fetchWithAuth(
                                                `https://backend-masjid-production.up.railway.app/arus-kas/${selectedRow.id}`,
                                                {
                                                    method: "PUT",
                                                    headers: {
                                                        "Content-Type":
                                                            "application/json",
                                                    },
                                                    body: JSON.stringify(
                                                        selectedRow,
                                                    ),
                                                },
                                            );

                                            setRows((prev) =>
                                                prev.map((row) =>
                                                    row.id === selectedRow.id
                                                        ? selectedRow
                                                        : row,
                                                ),
                                            );
                                            setEditMode(false);
                                            setModalOpen(false);
                                        } catch (error) {
                                            console.error(
                                                "Error updating data:",
                                                error,
                                            );
                                        }
                                    }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Simpan
                                </Button>
                                <Button
                                    onClick={() => setEditMode(false)}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    Batal
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setEditMode(true)}
                                variant="contained"
                                color="primary"
                            >
                                Edit
                            </Button>
                        )}
                        <Button onClick={handleModalClose} color="secondary">
                            Tutup
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

{isConfirmModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1000">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Penghapusan</h2>
            <p>Apakah Anda yakin ingin menghapus {selectedItems.length} item yang dipilih?</p>
            <div className="mt-4 flex justify-end gap-2">
                <button
                    onClick={cancelBulkDelete}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                    Batal
                </button>
                <button
                    onClick={confirmBulkDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Hapus
                </button>
            </div>
        </div>
    </div>
)}

            ;
        </div>
    );
}
