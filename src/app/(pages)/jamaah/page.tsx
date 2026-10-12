"use client";
import React, { useState, useEffect } from 'react';
import DefaultLaout from "@/components/Layouts/DefaultLayout";
import DataTable from '@/components/DataTable/DataTabel3';
import { Button, Box, Typography, Paper, InputBase, IconButton, Select, MenuItem, FormControl, SelectChangeEvent, CircularProgress } from '@mui/material';
import { AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';
import SearchIcon from '@mui/icons-material/Search';
import ModalForm from '@/components/Modal/ModalJamaah';
import { jsPDF } from "jspdf";
import axios from '@/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { SlActionUndo } from "react-icons/sl";
import AlertConfirm from '@/components/Alerts/AlertConfirm';

interface Jamaah {
  nama: string;
  gender: string;
  birth: string;
  kontak: string;
  email: string;
  alamat: string;
  keterangan: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: 'jamaah' | 'yatim-dhuafa';
}

export default function Jamaah() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [jamaahData, setJamaahData] = useState<Jamaah[]>([]);
  const [filteredData, setFilteredData] = useState<Jamaah[]>([]);
  const [isRestore, setIsRestore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState<number[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = isRestore ? '/jamaah/deleted' : '/jamaah';
      const response = await axios.get(url);
      setJamaahData(response.data);
      setFilteredData(response.data);
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
    let filtered = jamaahData;

    if (status && status !== "Semua") {
      filtered = filtered.filter((jamaah) => jamaah.keterangan === status);
    }

    if (searchTerm) {
      filtered = filtered.filter((jamaah) =>
        jamaah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jamaah.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jamaah.birth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jamaah.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jamaah.kontak.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jamaah.alamat.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [status, searchTerm, jamaahData]);

  const reloadData = () => {
    const url = isRestore ? '/jamaah/deleted' : '/jamaah';
    axios
      .get(url)
      .then((response) => {
        setJamaahData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error re-fetching data:", error);
      });
  };

  const handleRestore = async () => {
    try {
      if (selectedRestoreIds.length === 0) return;
  
      const type = 'jamaah';
      await axios.patch(`/${type}/${selectedRestoreIds.join(',')}/restore`);
  
      toast.success('Data restored successfully');
      setShowConfirm(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to restore data');
      setShowConfirm(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = () => {
    fetchData();
    closeModal();
  };

  const handleRestoreSelection = (ids: number[]) => {
    setSelectedRestoreIds(ids);
    setShowConfirm(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value);
  };

  const handleExport = () => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    const doc = new jsPDF("p", "cm", "a4");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Export Date: ${currentDate}`, 1, 1); // Date at the top-left

    const headers = ["No", "Nama", "Jenis Kelamin", "Tanggal Lahir", "Kontak", "Email", "Alamat", "Status"];
    const tableData = jamaahData.map((row, index) => [
      index + 1,
      row.nama,
      row.gender,
      row.birth,
      row.kontak,
      row.email,
      row.alamat,
      row.keterangan
    ]);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Data Jamaah", 10.5, 1, { align: 'center' });

    let yPosition = 2;
    const cellHeight = 0.8;
    const columnWidths = [1, 3, 2.5, 2.5, 3, 4, 4, 3];

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); 

    doc.setFontSize(10);
    headers.forEach((header, index) => {
      const xPosition = columnWidths.slice(0, index).reduce((a, b) => a + b, 1);
      doc.text(header, xPosition + columnWidths[index] / 2, yPosition, { align: 'center' });
    });

    yPosition += cellHeight;
    doc.setFont("helvetica", "normal"); 

    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        const xPosition = columnWidths.slice(0, index).reduce((a, b) => a + b, 1);
        doc.text(String(cell), xPosition + columnWidths[index] / 2, yPosition, { align: 'center' });
      });

      yPosition += cellHeight;
    });

    doc.save(`${currentDate}_Data Jamaah.pdf`);


  };

  const JamaahColumns: Column[] = [
    { header: 'No', accessor: 'nomor' },
    { header: 'Nama', accessor: 'nama' },
    { header: 'Jenis Kelamin', accessor: 'gender' },
    { header: 'Tanggal Lahir', accessor: 'birth' },
    { header: 'Kontak', accessor: 'kontak' },
    { header: 'Email', accessor: 'email' },
    { header: 'Alamat', accessor: 'alamat' },
    { header: 'Status', accessor: 'keterangan' },
    { header: 'Tindakan', accessor: '', type: 'jamaah' },
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
            width: '100%'
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: '600', fontFamily: 'Nunito Sans' }}
          >
            Data Jamaah
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
              Tambah Data
            </Button>
            <Button
              variant="contained"
              color="warning"
              startIcon={<AiOutlineUpload />}
              onClick={handleExport} 
            >
              Export Data
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

          <FormControl sx={{
            minWidth: '180px',
            marginLeft: '10px',
          }}>
            <Select
              displayEmpty
              value={status}
              onChange={handleStatusChange}
              sx={{
                backgroundColor: '#F5F7FA',
                borderRadius: '10px',
                padding: '0px 10px', 
                height: '40px', 
                border: 'none',
                boxShadow: 'none',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, 
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#888' }}>Status</span>;
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <span>Pilih Status</span>
              </MenuItem>
              <MenuItem value="Semua">Semua</MenuItem>
              <MenuItem value="aktif">Aktif</MenuItem>
              <MenuItem value="pindah">Pindah</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ marginTop: '20px' }}>
            <DataTable columns={JamaahColumns} data={filteredData} fetchUrl='/jamaah' reloadData={reloadData} isRestore={isRestore} onRestore={handleRestoreSelection} />
          </Box>
        )}
      </div>
      <ModalForm isOpen={isModalOpen} onClose={closeModal} onSubmit={handleModalSubmit} onSuccess={(message: string) => toast.success(message)} />
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />

      <AlertConfirm
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRestore}
        message="Apakah Anda Yakin Ingin Restore Data?"
      />

    </DefaultLaout>
  );
}
