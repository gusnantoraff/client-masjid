"use client";
import React, { useEffect, useState } from 'react';
import DefaultLaout from "@/components/Layouts/DefaultLayout";
import DataTable from '@/components/DataTable/DataTabel3';
import { Button, Box, Typography, Paper, InputBase, IconButton, Select, MenuItem, FormControl, SelectChangeEvent, CircularProgress } from '@mui/material';
import { AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';
import ModalForm from '@/components/Modal/ModalYatim';
import SearchIcon from '@mui/icons-material/Search';
import { jsPDF } from "jspdf";
import axios from '@/utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns'; 
import { SlActionUndo } from "react-icons/sl";
import AlertConfirm from '@/components/Alerts/AlertConfirm';

interface YatimDhuafa {
  nama: string;
  gender: string;
  kontak: string;
  birth: string;
  alamat: string;
  keterangan: string;
  status: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: 'jamaah' | 'yatim-dhuafa';
}

export default function YatimDhuafa() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [yatimData, setYatimData] = useState<YatimDhuafa[]>([]);
  const [filteredData, setFilteredData] = useState<YatimDhuafa[]>([]);
  const [isRestore, setIsRestore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState<number[]>([]);

  const fetchData = async () => {
   setLoading(true);
    try {
      const url = isRestore ? '/yatim-dhuafa/deleted' : '/yatim-dhuafa';
      const response = await axios.get(url);
      setYatimData(response.data);
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
    let filtered = yatimData;

    if (status && status !== "Semua") {
      filtered = filtered.filter((yatim) => yatim.keterangan === status);
    }

    if (searchTerm) {
      filtered = filtered.filter((yatim) =>
        yatim.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yatim.birth.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yatim.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yatim.kontak.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yatim.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        yatim.status.toLowerCase().includes(searchTerm.toLowerCase())

      );
    }

    setFilteredData(filtered);
  }, [status, searchTerm, yatimData]);

  const reloadData = () => {
    const url = isRestore ? '/yatim-dhuafa/deleted' : '/yatim-dhuafa';
    axios
      .get(url)
      .then((response) => {
        setYatimData(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Error re-fetching data:", error);
      });
  };

  const handleRestore = async () => {
    try {
      if (selectedRestoreIds.length === 0) return;
  
      const type = 'yatim-dhuafa';
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
    setStatus(event.target.value as string);
  };

  const handleExport = () => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    const doc = new jsPDF("p", "cm", "a4");

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Export Date: ${currentDate}`, 1, 1); // Date at the top-left

    const headers = ["No", "Nama","Jenis Kelamin", "Kontak", "Tanggal Lahir", "Alamat", "Keterangan", "Status"];
    const tableData = yatimData.map((row, index) => [
      index + 1,
      row.nama,
      row.gender,
      row.kontak,
      row.birth,
      row.alamat,
      row.keterangan,
      row.status
    ]);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Data Yatim & Dhuafa", 10.5, 1, { align: 'center' });

    let yPosition = 2;
    const cellHeight = 0.8;
    const columnWidths = [1, 3, 2.5, 2.5, 3, 4, 4, 3];

    // Set header styles (bold text, no background)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Black text color for header

    doc.setFontSize(10);
    headers.forEach((header, index) => {
      const xPosition = columnWidths.slice(0, index).reduce((a, b) => a + b, 1);
      doc.text(header, xPosition + columnWidths[index] / 2, yPosition, { align: 'center' });
    });

    yPosition += cellHeight;
    doc.setFont("helvetica", "normal"); // Reset to normal font for data rows

    // Data row styles (plain text, no background)
    tableData.forEach((row) => {
      row.forEach((cell, index) => {
        const xPosition = columnWidths.slice(0, index).reduce((a, b) => a + b, 1);
        doc.text(String(cell), xPosition + columnWidths[index] / 2, yPosition, { align: 'center' });
      });

      yPosition += cellHeight;
    });

    doc.save(`${currentDate}_Data Yatim Dhuafa.pdf`);

  };

  const yatimColumns: Column[] = [
    { header: 'No', accessor: 'nomor' },
    { header: 'Nama', accessor: 'nama' },
    { header: 'Jenis Kelamin', accessor: 'gender' },
    { header: 'Kontak', accessor: 'kontak' },
    { header: 'Tanggal Lahir', accessor: 'birth' },
    { header: 'Alamat', accessor: 'alamat' },
    { header: 'Keterangan', accessor: 'keterangan' },
    { header: 'Status', accessor: 'status' },
    { header: 'Tindakan', accessor: '', type: 'yatim-dhuafa' },
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
            Data Yatim & Dhuafa
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

        {/* Box containing search bar and status */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          maxWidth: '600px',  // Limit the width of the container
        }}>
          {/* Search Bar */}
          <Paper
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '0px 10px',  // Adjust padding for consistent height
              borderRadius: '10px',
              backgroundColor: '#F5F7FA',
              boxShadow: 'none',  // Removed shadow from the search bar
              width: '55%',  // Occupy 55% of the width
              height: '40px',  // Set fixed height to match Select
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

          {/* Status Dropdown */}
          <FormControl sx={{
            minWidth: '180px',
            marginLeft: '10px',  // Reduced space between the search and status dropdown
          }}>
            <Select
              displayEmpty
              value={status}
              onChange={handleStatusChange}
              sx={{
                backgroundColor: '#F5F7FA',
                borderRadius: '10px',
                padding: '0px 10px',  // Adjust padding to match the search bar
                height: '40px',  // Fixed height to match search bar
                border: 'none',
                boxShadow: 'none',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },  // Remove default outline
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: '#888' }}>Keterangan</span>; // Placeholder style
                }
                return selected;
              }}
            >
              <MenuItem value="">
                <span>Pilih Keterangan</span>
              </MenuItem>
              <MenuItem value="Semua">Semua</MenuItem>
              <MenuItem value="yatim">Yatim</MenuItem>
              <MenuItem value="piatu">Piatu</MenuItem>
              <MenuItem value="dhuafa">Dhuafa</MenuItem>
              <MenuItem value="yatim piatu">Yatim Piatu</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ marginTop: '20px' }}>
          <DataTable columns={yatimColumns} data={filteredData} fetchUrl='/yatim-dhuafa' reloadData={reloadData} isRestore={isRestore} onRestore={handleRestoreSelection}/>
        </Box>
        )}
      </div>
      <ModalForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        onSuccess={(message: string) => toast.success(message)}
      />
      <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />

      <AlertConfirm
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRestore}
        message="Apakah Anda Yakin Ingin Restore Data?"
      />
    </DefaultLaout>
  );
};
