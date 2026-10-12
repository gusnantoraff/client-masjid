import { useEffect, useState } from "react";
import axios from '@/utils/axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Checkbox } from '@mui/material';
import { BiTrash, BiEdit } from 'react-icons/bi';
import AlertConfirm from "../Alerts/AlertConfirm";
import { AiOutlineEye } from "react-icons/ai";

interface Column {
    header: string;
    accessor: string;
    type?: 'berita' | 'pengaturan-akun';
}

interface DataTableProps {
    columns: Column[];
    data?: any[];
    fetchUrl: string;
    reloadData?: () => void;
    isRestore?: boolean;
    onRestore?: (id: number[], type: "berita" | "pengaturan-akun") => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, fetchUrl, data, reloadData, isRestore, onRestore }) => {
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

    const handleEdit = (id: any, type: 'berita' | 'pengaturan-akun') => {
        if (type === 'berita') {
            window.location.href = `/berita/${id}?edit=true`;
        } else if (type === 'pengaturan-akun') {
            window.location.href = `/pengaturan-akun/${id}?edit=true`;
        }
    };

    const handleDetail = (id: any, type: 'berita' | 'pengaturan-akun') => {
        if (type === 'berita') {
            window.location.href = `/berita/${id}`;
        } else if (type === 'pengaturan-akun') {
            window.location.href = `/pengaturan-akun/${id}`;
        }
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
            onRestore(selectedIds, columns[0].type as "berita" | "pengaturan-akun");
            setSelectedIds([]);
        }
    };

    const capitalizeFirstLetter = (value: any, accessor: string) => {
        if (typeof value === 'string' && accessor !== 'email') {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    };

    const truncateContent = (content: string, limit: number = 20) => {
        const text = content
            .replace(/&nbsp;/g, ' ')
            .replace(/<\/?[^>]+(>|$)/g, "");
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    return (
        <Box sx={{ width: '100%', overflowX: 'auto', border: '1px solid #E0E0E0', borderRadius: '10px' }}>
            {showConfirm && (
                <AlertConfirm
                    open={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleDelete}
                    message="Apakah Anda yakin ingin menghapus data ini?"
                />
            )}
            <Table sx={{ width: '100%' }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column, idx) => (
                            <TableCell
                                key={idx}
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    padding: '16px',
                                }}
                            >
                                {column.accessor === "" && isRestore ? (
                                    <Checkbox
                                        checked={selectedIds.length === fetchedData.length}
                                        onChange={handleSelectAll}
                                    />
                                ) : (
                                    column.header
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(data || []).map((row, idxData) => (
                        <TableRow key={idxData}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.accessor}
                                    sx={{
                                        padding: '16px',
                                        borderBottom: '1px solid #E0E0E0',
                                    }}
                                >
                                    {column.accessor === 'nomor'
                                        ? idxData + 1
                                        : column.accessor === 'konten' || column.accessor === 'judul'
                                            ? truncateContent(row[column.accessor])
                                            : capitalizeFirstLetter(row[column.accessor], column.accessor)
                                    }

                                    {column.accessor === "" && isRestore && (
                                        <Checkbox
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => handleSelect(row.id)}
                                        />
                                    )}

                                    {column.accessor === '' && !isRestore && (
                                        <Box sx={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
                                            <Button variant="contained" color="error" sx={{ padding: "4px 6px", minWidth: "auto", fontSize: "0.7rem" }} startIcon={<BiTrash />} onClick={() => promptDelete(row.id)}>Hapus</Button>
                                            <Button variant="contained" sx={{ backgroundColor: "#14B8A6", color: "white", marginLeft: "6px", padding: "4px 7px", minWidth: "auto", fontSize: "0.7rem" }} startIcon={<BiEdit />} onClick={() => handleEdit(row.id, column.type as 'berita' | 'pengaturan-akun')}>Edit</Button>
                                            <Button variant="contained" sx={{ backgroundColor: "#2379DC", color: "white", marginLeft: "8px", padding: "4px 6px", minWidth: "auto", fontSize: "0.7rem" }} startIcon={<AiOutlineEye />} onClick={() => handleDetail(row.id, column.type as 'berita' | 'pengaturan-akun')}>Detail</Button>
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
