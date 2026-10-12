"use client";
import React, { useState, useEffect } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataTable from '@/components/DataTable/TabelSurat';
import { Button, Box, Paper, InputBase, Typography, IconButton, CircularProgress } from '@mui/material';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalForm from '@/components/Modal/ModalSurat';
import SuratTemplateForm from '@/components/TemplateSurat';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlActionUndo } from "react-icons/sl";
import axios from '@/utils/axios';
import AlertConfirm from '@/components/Alerts/AlertConfirm';
import SearchIcon from '@mui/icons-material/Search';

interface Surat {
  id: number;
  judul_surat: string;
  isi_surat: string;
  tanggal: string;
  tanda_tangan: string;
  stempel: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: 'surat'
}

export default function Surat() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<Surat[]>([]);
  const [suratData, setSuratData] = useState<Surat[]>([]);
  const [isRestore, setIsRestore] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState<number[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openTemplateModal = () => {
    setIsTemplateModalOpen(true);
  };

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
  };

  const handleSubmit = () => {
    fetchData();
    closeModal();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = isRestore ? '/template-surat/deleted' : '/template-surat';
      const response = await axios.get(url);
      setSuratData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchData();
  }, [isRestore]);

  useEffect(() => {
    let filtered = suratData;
  
    if (searchTerm) {
      filtered = filtered.filter((surat) =>
        surat.judul_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surat.tanggal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    setFilteredData(filtered);
  }, [searchTerm, suratData]);

  const reloadData = () => {
    const url = isRestore ? '/template-surat/deleted' : '/template-surat';
    axios
      .get(url)
      .then((response) => {
        setSuratData(response.data);
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

      const type = 'template-surat';
      await axios.patch(`/${type}/${selectedRestoreIds.join(',')}/restore`);

      toast.success('Data restored successfully');
      setShowConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to restore data');
      setShowConfirm(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const akunColumns: Column[] = [
    { header: 'No', accessor: 'nomor' },
    { header: 'Judul Surat', accessor: 'judul_surat' },
    { header: "Tanggal", accessor: "tanggal" },
    { header: 'Tindakan', accessor: '' },
  ];

  return (
    <DefaultLayout>
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
            Surat Menyurat
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
             
              onClick={openModal}
            >
              Tambah Surat
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#1E40AF', color: 'white'}}
              startIcon={<AiOutlinePlus />}
              onClick={openTemplateModal}
            >
              Tambah Surat by Template
            </Button>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          maxWidth: '600px',
        }}>

          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '0px 10px', 
              borderRadius: '10px',
              backgroundColor: '#F5F7FA',
              boxShadow: 'none', 
              width: '55%', 
              height: '40px', 
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Paper>
        </Box>

        <SuratTemplateForm
          isOpen={isTemplateModalOpen}
          onClose={closeTemplateModal}
          onSubmit={handleSubmit}
        />

        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        ) : (
          <DataTable
            columns={akunColumns}
            fetchUrl='/template-surat'
            data={filteredData}
            reloadData={reloadData}
            isRestore={isRestore}
            onRestore={handleRestoreSelection}
          />
        )}

        <ModalForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={(message: string) => toast.success(message)}
          onSubmit={handleSubmit} 
        />

        <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />
        <AlertConfirm open={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleRestore} message="Apakah Anda Yakin Ingin Restore Data?" />
      </div>
    </DefaultLayout>
  );
}
