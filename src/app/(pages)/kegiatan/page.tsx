"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState } from "react";
import ButtonDefault from '@/components/Buttons/ButtonDefault';
import { BiPlus } from 'react-icons/bi';
import Modal from '@/components/Modal/ModalKegiatan';
import ListKegiatan from '@/components/KegiatanComponents/ListKegiatan';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Kegiatan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    setRefreshList(prev => !prev);
    closeModal();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    if (name === "endDate") setEndDate(value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <DefaultLayout>
      <div className="flex justify-end">
        <ButtonDefault
          customClasses="bg-red-500 text-white p-3 w-60 flex rounded-lg"
          label="Tambah Kegiatan"
          onClick={openModal}
        >
          <BiPlus />
        </ButtonDefault>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} onSuccess={(message: string) => toast.success(message)}/>
      
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />

      {/* Filter Section */}
      <div className="flex justify-start items-center mt-4">
        <div className="flex gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Tanggal Awal</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="p-2 h-10 border-2 border-gray-500 rounded"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Tanggal Akhir</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              className="p-2 h-10 border-2 border-gray-500 rounded"
            />
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">Pilih Bulan</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="p-2 h-10 border-2 border-gray-500 rounded"
            >
              <option value="">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>
        </div>
      </div>

      <ListKegiatan
        refresh={refreshList}
        startDate={startDate}
        endDate={endDate}
        selectedMonth={selectedMonth}
      />
    </DefaultLayout>
  );
}
