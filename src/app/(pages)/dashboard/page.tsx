"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState } from "react";
import Kegiatan from "@/components/Kegiatan";
import InfoMasjid from "./infomasjid";
import ListKegiatan from "@/components/KegiatanComponents/ListKegiatanDashboard";
import StatsArus from "../dashboard/stats";
import PendapatanChart from "../keuangan/arus-kas/pendapatanchart";
import PengeluaranChart from "../keuangan/arus-kas/pengeluaranchart";
import Filter from "../keuangan/arus-kas/DateFilter";

export default function Home() {
    const [refreshList, setRefreshList] = useState(false);

    const handleRefresh = () => {
        setRefreshList((prev) => !prev);
    };

    return (
        <>
            <DefaultLayout>
                {/* Info Masjid Section */}
                <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-dark dark:bg-gray-dark dark:shadow-lg">
                    <InfoMasjid />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[70%_30%]">
                    <div className="col-span-1 pt-2">
                        {/* Pendapatan dan Pengeluaran Charts */}
                        <div className="flex gap-2 rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-dark dark:bg-gray-dark dark:shadow-lg">
                            <div className="w-1/2 p-2">
                                <PendapatanChart filter={Filter}/>
                            </div>
                            <div className="w-1/2 p-2">
                                <PengeluaranChart filter={Filter}/>
                            </div>
                        </div>

                        {/* Stats Arus Section */}
                        <div className="mt-4 w-full">
                            <StatsArus showDashboardOnly={true} />
                        </div>
                    </div>

                    {/* Right Section: News */}
                    <div className="col-span-1">
                        <Kegiatan />
                        <ListKegiatan refresh={refreshList} size="small" />
                    </div>
                </div>
            </DefaultLayout>
        </>
    );
}
