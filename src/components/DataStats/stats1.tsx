"use client";

import React, { useState, useRef, useEffect } from "react";
import { LineChart } from "@mui/x-charts";

// Data berdasarkan tahun
const dataTahunan = {
    2022: {
        keluar: [500000, 1000000, 4000000],
        masuk: [100000, 3000000, 500000],
    },
    2023: {
        keluar: [700000, 1200000, 4500000],
        masuk: [200000, 3500000, 600000],
    },
    2024: {
        keluar: [600000, 1500000, 4200000],
        masuk: [300000, 4000000, 700000],
    },
};

const xLabels = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

export default function StatsLine() {
    const [selectedYear, setSelectedYear] = useState(2024);
    const [chartWidth, setChartWidth] = useState(1000);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Mengambil data berdasarkan tahun yang dipilih
    const keluarData = dataTahunan[selectedYear].keluar;
    const masukData = dataTahunan[selectedYear].masuk;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                padding: "20px",
            }}
        >
            <p className="text-xl font-bold text-black">Laporan Tahunan</p>
            {/* Dropdown untuk memilih tahun */}
            <div style={{ marginBottom: "20px", width: "100%" }}>
                <label
                    htmlFor="yearSelect"
                    className="text-xl font-medium text-black"
                    style={{
                        color: "black",
                        marginRight: "10px",
                        fontSize: "16px",
                    }}
                >
                    Pilih Tahun:
                </label>
                <select
                    className="text-xl font-medium text-black"
                    id="yearSelect"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{ padding: "5px", fontSize: "16px", color: "black" }}
                >
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                </select>
            </div>

            {/* Container untuk LineChart */}
            <div
                ref={containerRef}
                style={{ width: "100%", overflowX: "auto" }}
            >
                <LineChart
                    width={Math.max(chartWidth, 1000)}
                    height={400}
                    series={[
                        {
                            data: keluarData,
                            label: "Pengeluaran",
                            color: "red",
                        },
                        { data: masukData, label: "Pemasukan", color: "green" },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    yAxis={[
                        {
                            scaleType: "linear",
                            min: 0,
                            max: 5000000,
                            ticks: [
                                0, 500000, 1000000, 1500000, 2000000, 2500000,
                                3000000, 3500000, 4000000, 4500000, 5000000,
                            ],
                        },
                    ]}
                    margin={{ left: 80 }} // Menambahkan margin kiri untuk memperlebar area y-axis
                    slotProps={{
                        legend: {
                            direction: "row",
                            position: { vertical: "top", horizontal: "middle" },
                            padding: 0,
                        },
                    }}
                />
            </div>
        </div>
    );
}
