"use client";

import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Filters from "@/components/filter/FilterTable";
import TableContent from "@/components/DataTable/TableJurnal";
import ExportJurnal from "@/components/filter/ExportJurnal";
import DetailJurnal from "@/components/DetailModal/DetailJurnal";
import axios from "@/utils/axios";

export default function Jurnal({
    isLaporanPage,
    isPenerimaanPage,
    isPengeluaranPage,
    isArusKasPage,
}) {
    const [rows, setRows] = useState([]);
    const [coaMap, setCoaMap] = useState({});
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        selectedMonth: "",
        status: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [modalData, setModalData] = useState({ open: false, row: null });
    const [isRestore, setIsRestore] = useState(false);
    const [restoreItems, setRestoreItems] = useState<any[]>([]);

    const COAUrl = "/coa";
    const ArusKasUrl = "/arus-kas";

    const pageTitle = isLaporanPage
        ? "Laporan Keuangan"
        : isPenerimaanPage
          ? "Penerimaan"
          : isPengeluaranPage
            ? "Pengeluaran"
            : "Jurnal Arus Kas";

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

    const onRestoreToggle = (id: any) => {
        setRestoreItems((prevItems) =>
            prevItems.includes(id)
                ? prevItems.filter((item) => item !== id)
                : [...prevItems, id]
        );
    };

    const toggleRestore = () => {
        setIsRestore((prev) => !prev);
    };

    const handleFilterChange = (newFilters) => setFilters(newFilters);

    const filteredRows = rows.filter((row) => {
        const rowDate = new Date(row.date);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;

        const isDateInRange =
            (!start || rowDate >= start) && (!end || rowDate <= end);
        const isMonthMatch =
            !filters.selectedMonth ||
            rowDate.getMonth() + 1 === parseInt(filters.selectedMonth, 10);
    
        return isDateInRange && isMonthMatch;
    });

    const displayedRows = filteredRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    return (
        <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
            <h1 className="mb-4 mt-2 px-2 text-center text-3xl font-bold text-black">
                {pageTitle}
            </h1>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <Filters
                    isRestore={isRestore}  // Kirimkan isRestore ke Filter
                    onRestoreToggle={toggleRestore}  // Kirimkan fungsi toggle ke Filter
                    filters={filters}
                    onFilterChange={setFilters}
                    isLaporanPage={isLaporanPage}
                    isPenerimaanPage={isPenerimaanPage}
                    isPengeluaranPage={isPengeluaranPage}
                    isArusKasPage={isArusKasPage}
                />
                {(isPenerimaanPage || isPengeluaranPage || isLaporanPage) && (
                    <ExportJurnal
                        filteredRows={filteredRows}
                        exportFileName={pageTitle}
                        pageTitle={pageTitle}
                    />
                )}
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableContent
                        rows={displayedRows}
                        coaMap={coaMap}
                        isRestore={isRestore}
                        restoreItems={restoreItems}
                        onRestoreToggle={onRestoreToggle}
                        onRowAction={(action, row) => {
                            if (action === "view") {
                                setModalData({ open: true, row });
                            } else if (action === "delete") {
                                const newRows = rows.filter((r) => r !== row);
                                setRows(newRows);
                            }
                        }}
                    />
                </Table>
            </TableContainer>
                <TablePagination
                component="div"
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPageOptions={[]}
            />
            <DetailJurnal
                 modalData={modalData}
                 onClose={() => setModalData({ open: false, row: null })}
                 onSave={(updatedRow) =>
                     setRows((prevRows) =>
                         prevRows.map((row) =>
                             row.id === updatedRow.id ? updatedRow : row // Ganti data lama dengan data yang diperbarui
                         )
                     )
                 }
                 coaMap={coaMap}
            />
        </div>
    );
}
