"use client"
import ButtonDefault from '@/components/Buttons/ButtonDefault'
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import React, { useState, useEffect } from 'react'
import fetchWithAuth from "@/utils/fetch";

const ProfilMasjid = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [namaMasjid, setNamaMasjid] = useState('');
  const [alamatMasjid, setAlamatMasjid] = useState('');
  const [deskripsiMasjid, setDeskripsiMasjid] = useState('');
  const [kontak, setKontak] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchMasjidInfo();
  }, [])

  const fetchMasjidInfo = async () => {
    try {
      const data = await fetchWithAuth('https://backend-masjid-production.up.railway.app/info-masjid/1');
      setNamaMasjid(data.nama_masjid);
      setAlamatMasjid(data.alamat);
      setDeskripsiMasjid(data.deskripsi);
      setKontak(data.kontak);
    } catch (error) {
      console.error('Error fetching masjid info:', error);
      setShowAlert(true);
    }
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNamaMasjid('');
    setAlamatMasjid('');
    setDeskripsiMasjid('');
    setKontak('');
    setErrorMessage('');
    setSuccessMessage('');
    setShowAlert(false);
    fetchMasjidInfo();
  };

  const handleSaveClick = async () => {
    try {
       await fetchWithAuth('https://backend-masjid-production.up.railway.app/info-masjid/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nama_masjid: namaMasjid, alamat: alamatMasjid, deskripsi: deskripsiMasjid, kontak: kontak })
      });
      setIsEditing(false);
      setSuccessMessage('Data berhasil diperbarui.');
      setShowAlert(true);
    } catch (error) {
      console.error('Error updating masjid info:', error);
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  }

  const handleNamaChange = (e) => {
    setNamaMasjid(e.target.value);
  };

  const handleAlamatChange = (e) => {
    setAlamatMasjid(e.target.value);
  };

  const handleDeskripsiChange = (e) => {
    setDeskripsiMasjid(e.target.value);
  };

  const handleKontakChange = (e) => {
    setKontak(e.target.value);
  };

  const closeAlert = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setShowAlert(false);
  };

  return (
    <div className="border rounded-lg border-grey-500 mt-4 mb-4 p-4 shadow-md dark:border-gray-dark dark:bg-gray-dark">
      <div className="flex justify-between">
        <h1 className="text-heading-6 font-bold text-dark dark:text-white">Profil Masjid</h1>
        {isEditing ? (
          <div className="flex space-x-2">
            <button onClick={handleSaveClick} className="text-green-500"><FaCheck size={20}/></button>
            <button onClick={handleCancelClick} className="text-gray-500"><FaTimes size={20}/></button>
          </div>
        ) : (
          <button onClick={handleEditClick} className="text-yellow-500"><FaEdit size={20}/></button>
        )}
      </div>


      {showAlert && (
        <div className="mb-4 bg-green-500 text-white p-4 rounded-lg flex justify-between items-center">
          {successMessage || errorMessage}
          <button onClick={closeAlert} className="text-white hover:text-gray-300">
            <FaTimes size={20}/>
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="cols-span-1 mt-2">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-slate-200">
            Nama Masjid
          </label>
          <input
            type="text"
            name="namaMasjid"
            value={namaMasjid}
            onChange={handleNamaChange}
            disabled={!isEditing}
            className="mb-4 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-slate-200">
            Alamat Masjid
          </label>
          <textarea
            rows={6}
            name="Alamat"
            value={alamatMasjid}
            onChange={handleAlamatChange}
            disabled={!isEditing}
            className="mb-4 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>
        <div className="cols-span-1 mt-2">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-slate-200">
            Nomor Telepon Kontak
          </label>
          <input
            type="number"
            name="kontak"
            value={kontak}
            onChange={handleKontakChange}
            disabled={!isEditing}
            className="mb-4 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-slate-200">
            Deskripsi Masjid
          </label>
          <textarea
            rows={6}
            name="deskripsiMasjid"
            value={deskripsiMasjid}
            onChange={handleDeskripsiChange}
            disabled={!isEditing}
            className="mb-4 w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ProfilMasjid;