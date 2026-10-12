"use client";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import Modal from "@/components/Modal/ModalArus";
import DateFilter from "./DateFilter";
import StatsArus from "./stats";
import PendapatanChart from "./pendapatanchart";
import PengeluaranChart from "./pengeluaranchart";
import TabelKeuangan from "../../tabel/TabelJurnal";

const ArusKas = () => {
    const [showModalPemasukan, setShowModalPemasukan] = useState(false);
    const [showModalPengeluaran, setShowModalPengeluaran] = useState(false);
    const [filter, setFilter] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const handleFilterChange = (newFilter: { month: number; year: number }) => {
        setFilter(newFilter);
    };

    const handleSubmit = () => {
        console.log("Data submitted successfully.");
        window.location.reload();
    };

    return (
        <DefaultLayout>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <h1 className="p-2 text-4xl font-bold text-black">
                        Arus Kas
                    </h1>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                    <ButtonDefault
                        customClasses="bg-green-600 text-white px-4 py-2 rounded-lg"
                        label="Tambah Pemasukan"
                        onClick={() => setShowModalPemasukan(true)}
                    >
                        <IoMdAdd className="text-white" />
                    </ButtonDefault>
                    <ButtonDefault
                        customClasses="bg-red-600 text-white px-4 py-2 rounded-lg"
                        label="Tambah Pengeluaran"
                        onClick={() => setShowModalPengeluaran(true)}
                    >
                        <IoMdAdd className="text-white" />
                    </ButtonDefault>
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

            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="cols-span-1">
                    <h1 className="mt-5 text-center text-2xl font-bold text-black">
                        Pemasukan
                    </h1>
                    <div className="mt-5 flex grid h-auto rounded-xl border border-gray-300 px-4 py-4 shadow-md">
                        <PendapatanChart filter={filter} />
                    </div>
                </div>
                <div className="cols-span-1">
                    <h1 className="mt-5 text-center text-2xl font-bold text-black">
                        Pengeluaran
                    </h1>
                    <div className="mt-5 flex grid h-auto rounded-xl border border-gray-300 px-4 py-4 shadow-md">
                        <PengeluaranChart filter={filter} />
                    </div>
                </div>
            </div>

            <div className="mt-5 flex w-full rounded-xl border border-gray-300 px-4 py-4 shadow-md">
                <TabelKeuangan
                    isArusKasPage={true}
                    isLaporanPage={false}
                    isPenerimaanPage={false}
                    isPengeluaranPage={false}
                />
            </div>

            <Modal
                isOpen={showModalPemasukan}
                onClose={() => setShowModalPemasukan(false)}
                onSubmit={handleSubmit}
                title="Tambah Pemasukan"
                targetUrl="/penerimaan-kas"
            />
            <Modal
                isOpen={showModalPengeluaran}
                onClose={() => setShowModalPengeluaran(false)}
                onSubmit={handleSubmit}
                title="Tambah Pengeluaran"
                targetUrl="/pengeluaran-kas"
            />
        </DefaultLayout>
    );
};

export default ArusKas;
