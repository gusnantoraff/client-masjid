import ButtonDefault from '@/components/Buttons/ButtonDefault'
import React from 'react'
import Stats from '../keuangan/arus-kas/stats'

const KeuanganMasjid = () => {
  return (
    <div className="border rounded-lg border-grey-500 mt-4 mb-4 p-4 shadow-md dark:border-gray-dark dark:bg-gray-dark">
        <div className="flex justify-between">
        <h1 className="text-heading-6 font-bold text-dark dark:text-white">Laporan Keuangan Masjid</h1>
        </div>
        <Stats/>
    </div>
  )
}

export default KeuanganMasjid