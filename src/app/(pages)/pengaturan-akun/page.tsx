"use client";
import React, { useState, useEffect } from 'react';
import DefaultLaout from "@/components/Layouts/DefaultLayout";
import DataTable from '@/components/DataTable/DataTabel1';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';
import ModalForm from '@/components/Modal/ModalAkun';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlActionUndo } from "react-icons/sl";
import axios from '@/utils/axios';
import AlertConfirm from '@/components/Alerts/AlertConfirm';

interface Users {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birth: string;
  gender: string;
  role: string;
  avatar: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: 'berita' | 'pengaturan-akun';
}

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState<Users[]>([]);
  const [isRestore, setIsRestore] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState<number[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = isRestore ? '/users/deleted' : '/users';
      const response = await axios.get(url);
      setUsersData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchData();
  }, [isRestore]);

  const reloadData = () => {
    const url = isRestore ? '/users/deleted' : '/users';
    axios
      .get(url)
      .then((response) => {
        setUsersData(response.data);
      })
      .catch((error) => {
        console.error("Error re-fetching data:", error);
      });
  };

  const handleRestoreSelection = (ids: number[]) => {
    setSelectedRestoreIds(ids);
    setShowConfirm(true);
  };

  const handleRestore = async () => {
    try {
      if (selectedRestoreIds.length === 0) return;

      const type = 'users';
      await axios.patch(`/${type}/${selectedRestoreIds.join(',')}/restore`);

      toast.success('Data restored successfully');
      setShowConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to restore data');
      setShowConfirm(false);
    }
  };

  const akunColumns: Column[] = [
    { header: 'No', accessor: 'nomor' },
    { header: 'First Name', accessor: 'firstname' },
    { header: 'Last Name', accessor: 'lastname' },
    { header: 'Email', accessor: 'email' },
    { header: 'Kontak', accessor: 'phone' },
    { header: 'Tanggal Lahir', accessor: 'birth' },
    { header: 'Gender', accessor: 'gender' },
    { header: 'Role', accessor: 'role' },
    { header: 'Tindakan', accessor: '', type: 'pengaturan-akun' },
  ];

  return (
    <DefaultLaout>
      <div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#EDF1F8',
            color: 'black',
            borderRadius: '10px',
            width: '100%',
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: '600', fontFamily: 'Nunito Sans' }}>
            Pengaturan Akun
          </Typography>
          <Box>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#FFB80D', color: 'white', marginRight: '10px' }}
              startIcon={<SlActionUndo />}
              onClick={() => setIsRestore(!isRestore)}
            >
              {isRestore ? 'Cancel Restore' : 'Restore Data'}
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#14B8A6', color: 'white', marginRight: '10px' }}
              startIcon={<AiOutlinePlus />}
              onClick={openModal}
            >
              Tambah Users
            </Button>
          </Box>
        </Box>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        ) : (
          <DataTable
            columns={akunColumns}
            fetchUrl='/users'
            data={usersData}
            reloadData={reloadData}
            isRestore={isRestore}
            onRestore={handleRestoreSelection}
          />
        )}

        <ModalForm isOpen={isModalOpen} onClose={closeModal} onSuccess={(message: string) => toast.success(message)} />
        <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />
        <AlertConfirm open={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleRestore} message="Apakah Anda Yakin Ingin Restore Data?" />
      </div>
    </DefaultLaout>
  );
}
