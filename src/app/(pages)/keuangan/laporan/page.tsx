"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import DateFilter from "../arus-kas/DateFilter";
import StatsArus from "../arus-kas/stats";
import Jurnal from "../arus-kas/jurnal";
import TabelKeuangan from "../../tabel/TabelJurnal";

export default function Home() {
    const [filter, setFilter] = React.useState({
        month: new Date().getMonth() + 1, // Bulan saat ini, dimulai dari 1
        year: new Date().getFullYear(), // Tahun saat ini
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    return (
        <>
            <DefaultLayout>
                <div className="grid grid-cols-2 gap-4">
                    <div className="cols-span-1">
                        <h1 className="p-2 text-4xl font-bold text-black">
                            Laporan Keuangan
                        </h1>
                    </div>
                </div>
                <div className="items-left justify-left flex grid flex-col">
                    <div className="mt-2">
                        <DateFilter
                            filter={filter}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>
                <StatsArus filter={filter} />
                <div className="mt-5 flex w-full rounded-xl border border-gray-300 px-4 py-4 shadow-md">
                <TabelKeuangan
                isArusKasPage={false}
                isLaporanPage={true}
                isPenerimaanPage={false}
                isPengeluaranPage={false}
                />
                </div>
            </DefaultLayout>
        </>
    );
}
