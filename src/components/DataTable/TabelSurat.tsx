import React, { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Checkbox } from "@mui/material";
import { BiTrash, BiEdit } from "react-icons/bi";
import AlertConfirm from "../Alerts/AlertConfirm";
import { AiOutlineEye, AiOutlineUpload } from "react-icons/ai";

interface Column {
    header: string;
    accessor: string;
}

interface DataTableProps {
    columns: Column[];
    data?: any[];
    fetchUrl?: string;
    reloadData?: () => void;
    isRestore?: boolean;
    onRestore?: (ids: number[]) => void;

}

const DataTable: React.FC<DataTableProps> = ({ columns, data, fetchUrl, reloadData, isRestore, onRestore }) => {
    const [fetchedData, setFetchedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    useEffect(() => {
        if (!data && fetchUrl) {
            axios
                .get(fetchUrl)
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
    }, [fetchUrl, data]);

    const handleDelete = async () => {
        if (selectedIds.length > 0) {
            const idToDelete = selectedIds[0];
            await axios.delete(`/template-surat/${idToDelete}`);
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

    const handleEdit = (id: any) => {
        window.location.href = `/template-surat/${id}?edit=true`;
    };

    const handleDetail = (id: any) => {
        window.location.href = `/template-surat/${id}`;
    };

    const handleDownloadPDF = (id: any) => {
        axios
            .get(`/surat/download-pdf/${id}`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `surat_${id}.pdf`);
                document.body.appendChild(link);
                link.click();
            })
            .catch((err) => {
                console.error("Error downloading PDF:", err);
            });
    };

    const handleSelect = (id: number) => {
        setSelectedIds(prevSelectedIds =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter(item => item !== id)
                : [...prevSelectedIds, id]
        );
    };

    const handleSelectAll = () => {
        const allIds = fetchedData.map((item) => item.id);
        if (selectedIds.length === fetchedData.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allIds);
        }
    };

    const handleRestoreSubmit = () => {
        if (onRestore && selectedIds.length > 0) {
            onRestore(selectedIds);
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
                                                onClick={() => handleEdit(row.id)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ backgroundColor: "#2379DC", color: "white" }}
                                                startIcon={<AiOutlineEye />}
                                                onClick={() => handleDetail(row.id)}
                                            >
                                                Detail
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                size="small"
                                                startIcon={<AiOutlineUpload />}
                                                onClick={() => handleDownloadPDF(row.id)}
                                            >
                                                Download
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
