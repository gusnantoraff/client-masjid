"use client";
import ArticleForm from "@/components/Berita";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import DataTable from "@/components/DataTable/DataTabel1";
import axios from "@/utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SlActionUndo } from "react-icons/sl";
import AlertConfirm from "@/components/Alerts/AlertConfirm";

interface Artikel {
  judul: string;
  tanggal_publikasi: string;
  kategori: string;
  status: string;
  foto: string;
}

interface Column {
  header: string;
  accessor: string;
  type?: "berita" | "pengaturan-akun";
}

export default function Artikel() {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRestore, setIsRestore] = useState(false);
  const [artikelData, setArtikelData] = useState<Artikel[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState<number[]>([]);

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleTambahBerita = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = () => {
    setReloadTrigger((prev) => !prev);
    setIsFormVisible(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = isRestore ? "/berita/deleted" : "/berita";
      const response = await axios.get(url);
      setArtikelData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isRestore, reloadTrigger]);

  const handleReloadData = () => {
    const url = isRestore ? "/berita/deleted" : "/berita";
    axios
      .get(url)
      .then((response) => {
        setArtikelData(response.data);
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

      const type = "berita";
      await axios.patch(`/${type}/${selectedRestoreIds.join(",")}/restore`);

      toast.success("Data restored successfully");
      setShowConfirm(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to restore data");
      setShowConfirm(false);
    }
  };

  const beritaColumns: Column[] = [
    { header: "No", accessor: "nomor" },
    { header: "Judul", accessor: "judul" },
    { header: "Tanggal Publikasi", accessor: "tanggal_publikasi" },
    { header: "Kategori", accessor: "kategori" },
    { header: "Konten", accessor: "konten" },
    { header: "Status", accessor: "status" },
    { header: "Tindakan", accessor: "", type: "berita" },
  ];

  const fetchUrl = "/berita";

  return (
    <DefaultLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#EDF1F8",
          color: "black",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "600", fontFamily: "Nunito Sans" }}
        >
          Berita / Artikel
        </Typography>
        <Box>
          {isFormVisible ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#d50000", color: "white", marginRight: "10px" }}
              startIcon={<AiOutlineClose />}
              onClick={handleCancel}
            >
              Batal
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#14B8A6", color: "white", marginRight: "10px" }}
              startIcon={<AiOutlinePlus />}
              onClick={handleTambahBerita}
            >
              Tambah Berita
            </Button>
          )}
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FFB80D", color: "white", marginLeft: "10px" }}
            startIcon={<SlActionUndo />}
            onClick={() => setIsRestore(!isRestore)}
          >
            {isRestore ? "Cancel Restore" : "Restore Data"}
          </Button>
        </Box>
      </Box>
      <div
        style={{
          ...styles.formContainer,
          ...(isFormVisible ? styles.formShow : styles.formHidden),
        }}
      >
        {isFormVisible && (
          <div>
            <ArticleForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </div>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : (
        <div style={{ marginTop: "20px" }}>
          <DataTable
            columns={beritaColumns}
            fetchUrl={fetchUrl}
            data={artikelData}
            reloadData={handleReloadData} 
            isRestore={isRestore}
            onRestore={handleRestoreSelection}
          />
        </div>
      )}
       <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />
          <AlertConfirm
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={handleRestore}
            message="Apakah Anda Yakin Ingin Restore Data?"
          />
    </DefaultLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  formContainer: {
    transition: "transform 0.5s",
  },
  formShow: {
    transform: "translateY(0)",
    transitionTimingFunction: "ease-in",
  },
  formHidden: {
    transform: "translateY(-100%)",
    transitionTimingFunction: "ease-out",
  },
};
