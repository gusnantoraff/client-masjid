import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Checkbox } from "@mui/material";
import { BiTrash, BiEdit } from "react-icons/bi";
import AlertConfirm from "../Alerts/AlertConfirm";
import { AiOutlineEye, AiOutlineWhatsApp } from "react-icons/ai";

interface Column {
  header: string;
  accessor: string;
  type?: 'jamaah' | 'yatim-dhuafa';
}

interface DataTableProps {
  columns: Column[];
  data?: any[];
  fetchUrl?: string;
  reloadData?: () => void;
  isRestore?: boolean;
  onRestore?: (ids: number[], type: "jamaah" | "yatim-dhuafa") => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, fetchUrl, reloadData, isRestore, onRestore }) => {
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    let fetchUrlWithDeleted = fetchUrl;
    if (isRestore) {
      fetchUrlWithDeleted = `${fetchUrl}/deleted`;
    }
    if (!data && fetchUrlWithDeleted) {
      axios
        .get(fetchUrlWithDeleted)
        .then((response) => {
          setFetchedData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setFetchedData(data || []);
      setLoading(false);
    }
  }, [fetchUrl, data, isRestore]);

  const handleDelete = async () => {
    if (selectedIds.length > 0) {
      const idToDelete = selectedIds[0];
      await axios.delete(`${fetchUrl}/${idToDelete}`);
      if (reloadData) reloadData();
      setFetchedData(fetchedData.filter((item) => item.id !== idToDelete));
      setSelectedIds([]);
      setShowConfirm(false);
    }
  };

  const promptDelete = (id: any) => {
    setSelectedIds([id]);
    setShowConfirm(true);
  };


  const handleEdit = (id: any, type: 'jamaah' | 'yatim-dhuafa') => {
    if (type === 'jamaah') {
      window.location.href = `/jamaah/${id}?edit=true`;
    } else if (type === 'yatim-dhuafa') {
      window.location.href = `/yatim-dhuafa/${id}?edit=true`;
    }
  };

  const handleDetail = (id: any, type: 'jamaah' | 'yatim-dhuafa') => {
    if (type === 'jamaah') {
      window.location.href = `/jamaah/${id}`;
    } else if (type === 'yatim-dhuafa') {
      window.location.href = `/yatim-dhuafa/${id}`;
    }
  };

  const handleWhatsApp = (id: number) => {
    const jamaah = fetchedData.find((j) => j.id === id);

    if (!jamaah || !jamaah.kontak) {
      console.error("Jamaah atau nomor kontak tidak ditemukan");
      return;
    }

    const formatKontak = (kontak: any) => {
      if (kontak.startsWith("0")) {
        return "62" + kontak.slice(1);
      }
      return kontak;
    };

    const waLink = `https://wa.me/${formatKontak(jamaah.kontak)}?text=Halo jamaah [nama-masjid], ${jamaah.nama} Apa kabar?`;

    window.open(waLink, "_blank");
  };

  const handleSelect = (id: number) => {
    if (!Array.isArray(selectedIds)) {
      setSelectedIds([]);
    }

    setSelectedIds(prevSelectedIds =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter(item => item !== id)
        : [...prevSelectedIds, id]
    );
  };


  const handleSelectAll = () => {
    const allIds = fetchedData.map((item) => item.id);
    if (!Array.isArray(selectedIds)) {
      setSelectedIds(allIds);
      return;
    }

    if (selectedIds.length === fetchedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };


  const handleRestoreSubmit = () => {
    if (onRestore && selectedIds.length > 0) {
      onRestore(selectedIds, columns[0].type as "jamaah" | "yatim-dhuafa");
      setSelectedIds([]);
    }
  };

  const capitalizeFirstLetter = (value: any, accessor: string) => {
    if (typeof value === "string" && accessor !== "email") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  const rowsToRender = data || fetchedData;

  return (
    <Box sx={{ width: "100%", overflowX: "auto", border: "1px solid #E0E0E0", borderRadius: "10px" }}>
      {showConfirm && (
        <AlertConfirm
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          message="Apakah Anda yakin ingin menghapus data ini?"
        />
      )}
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                {col.accessor === "" && isRestore ? (
                  <Checkbox
                    checked={selectedIds.length === fetchedData.length}
                    onChange={handleSelectAll}
                  />
                ) : (
                  col.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsToRender.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col.accessor}>
                  {col.accessor === "nomor"
                    ? idx + 1
                    : col.accessor === "email" || col.accessor === "alamat"
                      ? truncateText(row[col.accessor], 8)
                      : capitalizeFirstLetter(row[col.accessor], col.accessor)}

                  {col.accessor === "" && isRestore && (
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                    />
                  )}
                  {col.accessor === "" && !isRestore && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<BiTrash />}
                        onClick={() => promptDelete(row.id)}
                      >
                        Hapus
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#14B8A6", color: "white" }}
                        startIcon={<BiEdit />}
                        onClick={() => handleEdit(row.id, col.type || "jamaah")}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#2379DC", color: "white" }}
                        startIcon={<AiOutlineEye />}
                        onClick={() => handleDetail(row.id, col.type || "jamaah")}
                      >
                        Detail
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#25D366", color: "white" }}
                        startIcon={<AiOutlineWhatsApp />}
                        onClick={() => handleWhatsApp(row.id)}
                      >
                        WA
                      </Button>
                    </Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isRestore && (
        <Box sx={{ marginTop: 2, textAlign: "right", padding: "0 10px 10px 0" }}>
          <Button
            variant="contained"
            onClick={handleRestoreSubmit}
            disabled={selectedIds.length === 0}
            sx={{ backgroundColor: "#14B8A6" }}
          >
            Restore Data
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DataTable;
