"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect } from "react";
import PendapatanChart from "../arus-kas/pendapatanchart";
import DateFilter from "../arus-kas/DateFilter";
import fetchWithAuth from "@/utils/fetch";
import TabelKeuangan from "../../tabel/TabelJurnal";

const Home = () => {
    const [pemasukanTotal, setPemasukanTotal] = useState(0);
    const [filter, setFilter] = React.useState({
        month: new Date().getMonth() + 1, // Bulan saat ini, dimulai dari 1
        year: new Date().getFullYear(),   // Tahun saat ini
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    // const PendapatanChart = ({ filter }) => {
    //     try {
    //         // Logika komponen
    //         return <div>Chart Content Here</div>;
    //     } catch (error) {
    //         console.error("Error rendering PendapatanChart:", error);
    //         return <div className="text-red-500">Failed to load chart.</div>;
    //     }
    // };
    

    // Format numbers to Indonesian Rupiah format
    const formatRupiah = (number) =>
      new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
      }).format(number);

    // Fetch pemasukan total berdasarkan bulan dan tahun yang terpilih
    useEffect(() => {
        const fetchPemasukanTotal = async () => {
            try {
                const result = await fetchWithAuth("https://backend-masjid-production.up.railway.app/arus-kas");

                if (result && result.length > 0) {
                    const filteredData = result[0].penerimaan_kas.filter((item) => {
                        const itemDate = new Date(item.tanggal);
                        const itemMonth = itemDate.getMonth() + 1; // Bulan dimulai dari 0
                        const itemYear = itemDate.getFullYear();

                        // Filter berdasarkan bulan dan tahun
                        return itemMonth === filter.month && itemYear === filter.year;
                    });

                    // Hitung total penerimaan berdasarkan filter bulan dan tahun
                    const totalPemasukan = filteredData.reduce((sum, item) => sum + parseFloat(item.jumlah), 0);
                    setPemasukanTotal(totalPemasukan);
                }
            } catch (error) {
                console.error("Error fetching pemasukan total:", error);
            }
        };

        fetchPemasukanTotal();
    }, [filter]);  // Panggil ulang saat filter berubah

    return (
        <DefaultLayout>
            <h1 className="p-2 text-4xl font-bold text-black">Penerimaan</h1>

            {/* Filter Bulan dan Tahun */}
            <DateFilter filter={filter} onFilterChange={handleFilterChange} />

            <div className="grid grid-cols-2 gap-4">
                <div className="cols-span-1 flex w-full flex-col items-center justify-center rounded-xl border border-gray-300 bg-green-200 px-4 py-6 shadow-md">
                    <h2 className="w-auto p-2 text-center text-3xl font-medium text-black">
                        Total Penerimaan
                    </h2>
                    <h2 className="w-auto p-2 text-center text-3xl font-bold text-black">
                        {formatRupiah(pemasukanTotal)}
                    </h2>
                </div>

                <div className="cols-span-1 w-full rounded-xl border border-gray-300 px-2 py-2 shadow-md">
                    <PendapatanChart filter={filter} />
                </div>
            </div>

            <div className="mt-4 w-full rounded-xl border border-gray-300 px-2 py-2 shadow-md">
            <TabelKeuangan
                isArusKasPage={false}
                isLaporanPage={false}
                isPenerimaanPage={true}
                isPengeluaranPage={false}
                />
            </div>
        </DefaultLayout>
    );
};

export default Home;
