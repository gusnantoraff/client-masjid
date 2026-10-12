import React from 'react';
import DataTable from '@/components/DataTable/DataTabel1';
import { Button, Box, Typography } from '@mui/material';
import { AiOutlinePlus, AiOutlineUpload } from 'react-icons/ai';
import { Metadata } from "next";

export const metadata: Metadata = {
    title:
      "SIstem Manajemen Masjid",
    description: "This is Next.js Home page for NextAdmin Dashboard Kit",
  };

export default function KelolaMasjid() {

  const kelolaColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nama Masjid', accessor: 'nama_masjid' },
    { header: 'Kontak', accessor: 'kontak' },
    { header: 'Alamat', accessor: 'alamat' },
    { header: 'Tindakan', accessor: '' },
  ];

  const fetchUrl = '/info-masjid';

  const KelolaMasjid = () => {
    return (
        <div>
        <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px', 
          padding:'15px',
          backgroundColor: '#EDF1F8',
          color: 'black',
          borderRadius: '10px',
          width: '100%'
        }}
      >
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ fontWeight: '600', fontFamily:'Nunito Sans' }} 
        >
          Data Masjid
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#14B8A6', color: 'white', marginRight: '10px' }} 
            startIcon={<AiOutlinePlus />}
          >
            Tambah Data
          </Button>
          <Button 
            variant="contained" 
            color="warning" 
            startIcon={<AiOutlineUpload />}
          >
            Import Data
          </Button>
        </Box>
      </Box>
          <DataTable columns={kelolaColumns} fetchUrl={fetchUrl} />
        </div>
    );
  };

  return <KelolaMasjid />;
};
