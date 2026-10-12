import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { SlActionUndo } from "react-icons/sl";

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

type FilterProps = {
    filters: {
        startDate: string;
        endDate: string;
        selectedMonth: string;
        status: string;
    };
    onFilterChange: (filters: any) => void;
    isRestore: boolean;
    onRestoreToggle: () => void;
    isLaporanPage: boolean;
    isPenerimaanPage: boolean;
    isPengeluaranPage: boolean;
    isArusKasPage: boolean;
};

export default function Filters({
    filters,
    onFilterChange,
    isRestore,
    onRestoreToggle,
    isLaporanPage,
    isPenerimaanPage,
    isPengeluaranPage,
    isArusKasPage,
}) {
    // Destructure the filter properties
    const { startDate, endDate, selectedMonth, status } = filters;

    // Reset filters to their default values
    const handleReset = () => {
        onFilterChange({
            startDate: "",
            endDate: "",
            selectedMonth: "",
            status: "",
        });
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "16px",
                paddingTop: "10px",
                flexWrap: "wrap",
            }}
        >
            {/* Filter by Start Date */}
            <TextField
                label="Tanggal Mulai"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) =>
                    onFilterChange({ ...filters, startDate: e.target.value })
                }
                InputLabelProps={{
                    shrink: true,
                }}
            />

            {/* Filter by End Date */}
            <TextField
                label="Tanggal Akhir"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) =>
                    onFilterChange({ ...filters, endDate: e.target.value })
                }
                InputLabelProps={{
                    shrink: true,
                }}
            />

            {/* Render "Pilih Status" Filter Only for Arus Kas Page */}
            {isArusKasPage && (
                <TextField
                    select
                    label="Pilih Status"
                    size="small"
                    value={status}
                    onChange={(e) =>
                        onFilterChange({ ...filters, status: e.target.value })
                    }
                    style={{ minWidth: "150px" }}
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

            {/* Render "Pilih Bulan" Filter Only for Laporan, Penerimaan, and Pengeluaran Pages */}
            {(isLaporanPage || isPenerimaanPage || isPengeluaranPage) && (
                <TextField
                    select
                    label="Pilih Bulan"
                    size="small"
                    value={selectedMonth}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            selectedMonth: e.target.value,
                        })
                    }
                    style={{ minWidth: "150px" }}
                >
                    <MenuItem value="">Semua Bulan</MenuItem>
                    {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                            {month.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}

            {/* Reset Filters Button */}
            <Button
                variant="contained"
                onClick={handleReset}
                style={{ alignSelf: "center" }}
            >
                Reset Filter
            </Button>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#FFB80D",
                    color: "white",
                }}
                startIcon={<SlActionUndo style={{ fontSize: "15px" }} />}
                onClick={() => onRestoreToggle()}
                style={{ alignSelf: "center" }}
            >
                {isRestore ? "Cancel Restore" : "Restore Data"}
            </Button>
            
        </div>
    );
}
