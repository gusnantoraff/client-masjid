"use client";
import React, { useState } from "react";
import axios from "@/utils/axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface SuratTemplateProps {
  nomor: string;
  lampiran: string;
  hal: string;
  penerima: string;
  lokasi: string;
  isiSurat: string;
  tanggal: string;
  ttdKetua: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12,
  },
  divider: {
    borderTop: "1px solid #000",
    marginVertical: 10,
  },
  section: {
    marginBottom: 10,
    fontSize: 12,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    fontSize: 12,
    marginBottom: 5,
  },
  label: {
    width: 70,
  },
  isiSurat: {
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 10,
    textAlign: "justify",
  },
  rightAlign: {
    textAlign: "right",
    fontSize: 12,
  },
  ttd: {
    marginTop: 40,
    fontSize: 12,
    textAlign: "right",
  },
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

const SuratTemplate: React.FC<SuratTemplateProps> = ({
  nomor,
  lampiran,
  hal,
  penerima,
  lokasi,
  isiSurat,
  tanggal,
  ttdKetua,
}) => (
  <Document>
    <Page style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: "10px" }}>MASJID TERCODE</Text>
        <Text>Jl. Raya Janti No.223, RT.07/RW.20, Modalan, Banguntapan</Text>
        <Text>Kabupaten Bantul. Telp. 081234556789</Text>
      </View>
      <View style={styles.divider}></View>

      {/* Nomor, Lampiran, Hal */}
      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Nomor</Text>
          <Text>: {nomor}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Lampiran</Text>
          <Text>: {lampiran}</Text>
        </View>
        <View style={styles.sectionRow}>
          <Text style={styles.label}>Hal</Text>
          <Text>: {hal}</Text>
        </View>
      </View>

      {/* Kepada Yth */}
      <View style={[styles.section, styles.rightAlign]}>
        <Text>Kepada Yth.</Text>
        <Text>{penerima}</Text>
        <Text>Di {lokasi}</Text>
      </View>

      {/* Isi Surat */}
      <View>
        <Text style={styles.isiSurat}>{isiSurat}</Text>
      </View>

      {/* Tanggal dan TTD */}
      <View style={styles.ttd}>
        <Text>Bantul, {formatDate(tanggal)}</Text>
        <Text>Hormat kami,</Text>
        <Text style={{ marginTop: 50 }}>{ttdKetua}</Text>
        <Text>(Ketua)</Text>
      </View>
    </Page>
  </Document>
);

interface SuratTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const SuratTemplateForm: React.FC<SuratTemplateFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [judul, setJudul] = useState("");
  const [nomor, setNomor] = useState("");
  const [lampiran, setLampiran] = useState("");
  const [hal, setHal] = useState("");
  const [penerima, setPenerima] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [isiSurat, setIsiSurat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [ttdKetua, setTtdKetua] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        judul_surat: judul,
        nomor,
        lampiran,
        hal,
        penerima,
        lokasi,
        isi_surat: isiSurat,
        tanggal,
        nama_ttd: ttdKetua,
      };

      const response = await axios.post("/template-surat", payload);

      if (response.status === 201) {
        setIsDataSubmitted(true);
        alert("Data berhasil dikirim!");
      }
    } catch (error) {
      console.error("Gagal mengirim data", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  return (
    isOpen && (
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ textAlign: "center", margin: "20px", fontSize: '18px', fontStyle: "bold"}}>Template Surat Masjid</h1>
        <div style={{ padding: "20px", margin: "auto", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          <form onSubmit={handleDownload}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={{ flex: "1 1 45%" }}>
                <label>Judul Surat:</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <label>Nomor Surat:</label>
                <input
                  type="text"
                  value={nomor}
                  onChange={(e) => setNomor(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={{ flex: "1 1 45%" }}>
                <label>Lampiran:</label>
                <input
                  type="text"
                  value={lampiran}
                  onChange={(e) => setLampiran(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <label>Hal:</label>
                <input
                  type="text"
                  value={hal}
                  onChange={(e) => setHal(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={{ flex: "1 1 45%" }}>
                <label>Kepada Yth.:</label>
                <input
                  type="text"
                  value={penerima}
                  onChange={(e) => setPenerima(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <label>Lokasi:</label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Isi Surat:</label>
              <textarea
                value={isiSurat}
                onChange={(e) => setIsiSurat(e.target.value)}
                placeholder="Masukkan salam pembuka, isi surat, dan penutup di sini"
                style={textareaStyle}
              />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={{ flex: "1 1 45%" }}>
                <label>Tanggal:</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: "1 1 45%" }}>
                <label>Nama Ketua:</label>
                <input
                  type="text"
                  value={ttdKetua}
                  onChange={(e) => setTtdKetua(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <button onClick={handleDownload} style={buttonStyle}>
              Kirim Data dan Siapkan PDF
            </button>

            {isDataSubmitted && (
              <PDFDownloadLink
                document={
                  <SuratTemplate
                    nomor={nomor}
                    lampiran={lampiran}
                    hal={hal}
                    penerima={penerima}
                    lokasi={lokasi}
                    isiSurat={isiSurat}
                    tanggal={tanggal}
                    ttdKetua={ttdKetua}
                  />
                }
                fileName="surat.pdf"
              >
                <button type="button" style={buttonStyle}>Download Surat PDF</button>
              </PDFDownloadLink>
            )}

            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: "#dc3545" }}>
              Tutup
            </button>
          </form>
        </div>
      </div>
    )
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const textareaStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  marginRight: "5px"
};

export default SuratTemplateForm;
