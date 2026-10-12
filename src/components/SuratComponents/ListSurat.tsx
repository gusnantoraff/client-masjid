"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
import SuratCard from "./SuratCard";
import axios from "@/utils/axios";
import { jsPDF } from "jspdf";
import AlertConfirm from "../Alerts/AlertConfirm";
import { useRouter } from "next/navigation";

interface Surat {
  id: number;
  judul_surat: string;
  isi_surat: string;
  tanda_tangan: string;
  stempel: string;
}

interface ListSuratProps {
  refresh: boolean; // Tambahkan ini
}

const ListSurat: React.FC<ListSuratProps> = ({ refresh }) => {
  const [suratList, setSuratList] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<Surat | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const fetchSurat = async () => {
    try {
      const response = await axios.get("/template-surat");
      setSuratList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surat:", error);
      setError("Gagal memuat data surat.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  },[refresh]); 

  const handleEdit = (id: number) => {
    // Implementasi navigasi ke halaman edit surat
    console.log(`Edit surat dengan ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedId !== null) {
      try {
        await axios.delete(`/template-surat/${selectedId}`);
        setSuratList(suratList.filter((surat) => surat.id !== selectedId));
        setShowConfirm(false);
        setSelectedId(null);
      } catch (error) {
        console.error(`Error deleting surat with ID: ${selectedId}`, error);
      }
    }
  };

  const handleExportPDF = (surat: Surat) => {
    const doc = new jsPDF();
    doc.text(`Judul: ${surat.judul_surat}`, 10, 10);
    doc.text(`Isi Surat:`, 10, 20);
    doc.text(surat.isi_surat, 10, 30);
    doc.save(`${surat.judul_surat}.pdf`);
  };

  const handleDetail = (surat: Surat) => {
    setSelectedSurat(surat);
    setIsModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ padding: "20px" }}>
      {showConfirm && (
        <AlertConfirm
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDeleteConfirm}
          message="Apakah Anda yakin ingin menghapus surat ini?"
        />
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {suratList.map((surat) => (
          <SuratCard
            key={surat.id}
            judul_surat={surat.judul_surat}
            isi_surat={surat.isi_surat}
            tanda_tangan={surat.tanda_tangan}
            stempel={surat.stempel}
            onEdit={() => handleEdit(surat.id)}
            onDelete={() => handleDelete(surat.id)}
            onDetail={() => handleDetail(surat)}
            onExportPDF={() => handleExportPDF(surat)}
          />
        ))}
      </div>

      {selectedSurat && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box
            sx={{
              width: "500px",
              backgroundColor: "white",
              padding: "20px",
              margin: "100px auto",
              borderRadius: "10px",
            }}
          >
            <Typography variant="h5">{selectedSurat.judul_surat}</Typography>
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              {selectedSurat.isi_surat}
            </Typography>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default ListSurat;