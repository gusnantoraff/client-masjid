"use client";
import fetchWithAuth from "@/utils/fetch";
import React, { useEffect, useState } from "react";

interface StatsArusProps {
    showDashboardOnly?: boolean;
    filter: { month: number; year: number };
}

const StatsArus: React.FC<StatsArusProps> = ({
    showDashboardOnly = false,
    filter,
}) => {
    const [dataStatsList, setDataStatsList] = useState<any[]>([]);

    useEffect(() => {
        const month = filter?.month ?? new Date().getMonth() + 1;
        const year = filter?.year ?? new Date().getFullYear();

        const fetchData = async () => {
            try {
                const result = await fetchWithAuth(
                    "http://localhost:8000/api/arus-kas",
                );
                // Filter data for current month
                const filteredData = result.map((item: any) => {
                    const filteredPenerimaan = item.penerimaan_kas.filter(
                        (penerimaan: any) => {
                            const date = new Date(penerimaan.tanggal);
                            return (
                                date.getMonth() + 1 === month &&
                                date.getFullYear() === year
                            );
                        },
                    );

                    const filteredPengeluaran = item.pengeluaran_kas.filter(
                        (pengeluaran: any) => {
                            const date = new Date(pengeluaran.tanggal);
                            return (
                                date.getMonth() + 1 === month &&
                                date.getFullYear() === year
                            );
                        },
                    );

                    const totalPemasukan = filteredPenerimaan.reduce(
                        (sum: number, penerimaan: any) =>
                            sum + parseFloat(penerimaan.jumlah),
                        0,
                    );

                    const totalPengeluaran = filteredPengeluaran.reduce(
                        (sum: number, pengeluaran: any) =>
                            sum + parseFloat(pengeluaran.jumlah),
                        0,
                    );

                    return {
                        sisa_kas_total: totalPemasukan - totalPengeluaran,
                        pemasukan_total: totalPemasukan,
                        pengeluaran_total: totalPengeluaran,
                    };
                });

                // Fetch data for previous month
                const previousMonth = month === 1 ? 12 : month - 1;
                const previousYear = month === 1 ? year - 1 : year;

                const previousFilteredData = result.map((item: any) => {
                    const filteredPenerimaan = item.penerimaan_kas.filter(
                        (penerimaan: any) => {
                            const date = new Date(penerimaan.tanggal);
                            return (
                                date.getMonth() + 1 === previousMonth &&
                                date.getFullYear() === previousYear
                            );
                        },
                    );

                    const filteredPengeluaran = item.pengeluaran_kas.filter(
                        (pengeluaran: any) => {
                            const date = new Date(pengeluaran.tanggal);
                            return (
                                date.getMonth() + 1 === previousMonth &&
                                date.getFullYear() === previousYear
                            );
                        },
                    );

                    const totalPemasukan = filteredPenerimaan.reduce(
                        (sum: number, penerimaan: any) =>
                            sum + parseFloat(penerimaan.jumlah),
                        0,
                    );

                    const totalPengeluaran = filteredPengeluaran.reduce(
                        (sum: number, pengeluaran: any) =>
                            sum + parseFloat(pengeluaran.jumlah),
                        0,
                    );

                    return {
                        sisa_kas_total: totalPemasukan - totalPengeluaran,
                        pemasukan_total: totalPemasukan,
                        pengeluaran_total: totalPengeluaran,
                    };
                });

                // Calculate growth rates
                const currentData = filteredData[0] || {};
                const previousData = previousFilteredData[0] || {};

                const growthRatePemasukan = previousData.pemasukan_total
                    ? ((currentData.pemasukan_total -
                          previousData.pemasukan_total) /
                          previousData.pemasukan_total) *
                      100
                    : 0;

                const growthRatePengeluaran = previousData.pengeluaran_total
                    ? ((currentData.pengeluaran_total -
                          previousData.pengeluaran_total) /
                          previousData.pengeluaran_total) *
                      100
                    : 0;

                const growthRateSisaKas = previousData.sisa_kas_total
                    ? ((currentData.sisa_kas_total -
                          previousData.sisa_kas_total) /
                          previousData.sisa_kas_total) *
                      100
                    : 0;

                const formattedData = [
                    {
                        title: "Total Sisa Kas",
                        value: currentData.sisa_kas_total || 0,
                        growthRate: growthRateSisaKas,
                    },
                    {
                        title: "Total Pemasukan",
                        value: currentData.pemasukan_total || 0,
                        growthRate: growthRatePemasukan,
                    },
                    {
                        title: "Total Pengeluaran",
                        value: currentData.pengeluaran_total || 0,
                        growthRate: growthRatePengeluaran,
                    },
                ];

                const filteredDataStats = showDashboardOnly
                    ? formattedData.filter((item) =>
                          ["Total Pemasukan", "Total Pengeluaran"].includes(
                              item.title,
                          ),
                      )
                    : formattedData;

                setDataStatsList(filteredDataStats);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [filter, showDashboardOnly]);

    const formatRupiah = (number: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

    const gridLayout =
        dataStatsList.length === 2
            ? "grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

    return (
        <div className={`grid gap-4 ${gridLayout} 2xl:gap-6`}>
            {dataStatsList.length === 0 ? (
                <div className="text-center font-bold text-red-500">
                    Tidak ada data untuk bulan dan tahun yang dipilih.
                </div>
            ) : (
                dataStatsList.map((item) => (
                    <div
                        key={item.title}
                        className={`cols-span-1 mt-2 rounded-2xl px-4 py-4 shadow-md ${
                            item.title === "Total Pemasukan"
                                ? " bg-green-200"
                                : item.title === "Total Pengeluaran"
                                  ? " bg-red-600"
                                  : " bg-amber-500"
                        }`}
                    >
                        <h2 className="w-auto text-xl font-medium text-black dark:text-slate-800">
                            {item.title}
                        </h2>
                        <h2 className="w-auto text-2xl font-bold text-black dark:text-slate-800">
                            {formatRupiah(item.value)}
                        </h2>
                        <div className="mt-2 flex items-center">
                            <div
                                className={`rounded-full px-2 py-1 text-sm font-medium text-white ${
                                    item.growthRate > 0
                                        ? "border border-green-500 bg-green-700"
                                        : item.growthRate < 0
                                          ? "border border-red-400 bg-red-700"
                                          : "border border-gray-400 bg-gray-700"
                                }`}
                            >
                                {item.growthRate > 0 ? "+" : ""}
                                {item.growthRate.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StatsArus;
