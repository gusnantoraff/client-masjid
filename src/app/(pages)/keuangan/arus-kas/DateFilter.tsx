import React, { useEffect } from "react";
import { TextField, MenuItem, Button } from "@mui/material";

export default function Filter({ filter, onFilterChange }) {
    // Fungsi untuk menangani perubahan bulan
    const handleMonthChange = (e) => {
        onFilterChange({ ...filter, month: e.target.value });
    };

    // Fungsi untuk menangani perubahan tahun
    const handleYearChange = (e) => {
        onFilterChange({ ...filter, year: e.target.value });
    };

    // Fungsi pencarian yang dapat disesuaikan
    const handleSearch = () => {
        // Optional: Anda dapat memicu pencarian berdasarkan filter yang dipilih.
        console.log("Filter applied:", filter);
    };

    // Set default bulan dan tahun saat komponen pertama kali dirender
    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Karena getMonth() mengembalikan 0-11, kita tambah 1 agar bulan sesuai
        const currentYear = currentDate.getFullYear();

        // Set filter default ke bulan dan tahun sekarang
        onFilterChange({
            month: currentMonth,
            year: currentYear,
        });
    }, []); // UseEffect hanya dipanggil sekali saat komponen pertama kali dirender

    return (
        <div
            style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
            }}
        >
            {/* Dropdown Bulan */}
            <TextField
                select
                label="Bulan"
                value={filter.month}
                onChange={handleMonthChange}
                variant="outlined"
                margin="dense"
                size="small"
                style={{ width: "130px", marginRight: "16px" }} // Styling for month select
            >
                {Array.from({ length: 12 }, (_, index) => (
                    <MenuItem key={index} value={index + 1}>
                        {new Date(0, index).toLocaleString("default", {
                            month: "long",
                        })}
                    </MenuItem>
                ))}
            </TextField>

            {/* Input Tahun */}
            <TextField
                label="Tahun"
                type="number"
                value={filter.year}
                onChange={handleYearChange}
                variant="outlined"
                margin="dense"
                size="small"
                style={{ width: "100px", marginRight: "16px" }} // Styling for year input
            />

            {/* Tombol Cari
      <Button
        variant="contained"
        color="primary"
        style={{ height: "42px" }}
        onClick={handleSearch}
      >
        Cari
      </Button> */}
        </div>
    );
}
