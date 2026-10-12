import React from 'react'
import ButtonDefault from '../Buttons/ButtonDefault'
import { BiPlus } from 'react-icons/bi'

const Kegiatan = () => {
  return (
    <>
    <div>
        <h1 className="flex justify-start text-heading-6 font-bold text-dark dark:text-white mt-4">
          Daftar Kegiatan
        </h1>
        <hr className="border-t border-gray-300 mt-2 mb-3" />
      </div>
      <div className="flex justify-center mb-3">
        <ButtonDefault
          link="/kegiatan"
          customClasses="bg-red-500 text-white p-3 w-full flex rounded-lg"
          label="Tambah Kegiatan"
        >
          <BiPlus />
        </ButtonDefault>
      </div>
    </>

  )
}

export default Kegiatan