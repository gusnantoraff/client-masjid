"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DataTable from '@/components/DataTable/DataTabel2';  // Importing the reusable DataTable component
import { Box, Typography, Button } from "@mui/material";

const Pengaduan = () => {
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  const PengaduanColumns = [
    { header: 'Nama Pengirim', accessor: 'nama_pengirim' },
    { header: 'Email', accessor: 'email' },
    { header: 'Pesan', accessor: 'pesan' },
    { header: 'Tanggal', accessor: 'tanggal' },
    { header: 'Tindakan', accessor: '' },
  ];

  const fetchUrl = '/pesan-website';

  return (
    <DefaultLayout>
      {/* Box for Heading and Action Button */}
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
          Pesan & Pengaduan
        </Typography>
      </Box>
      
      {/* Data Table for Messages */}
      <DataTable columns={PengaduanColumns} fetchUrl={fetchUrl} reloadData={reloadData} />

    </DefaultLayout>
  );
};

export default Pengaduan;
