import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Link } from '@mui/material';
import { BiTrash } from 'react-icons/bi';
import AlertConfirm from "../Alerts/AlertConfirm";
import { AiOutlineEye, AiOutlineMail } from 'react-icons/ai';
import axios from '@/utils/axios';

interface Column {
    header: string;
    accessor: string;
}

interface DataTableProps {
    columns: Column[];
    fetchUrl: string;
    reloadData: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ columns, fetchUrl, reloadData}) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error] = useState<Error | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(fetchUrl);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [fetchUrl, reloadData]);

    const handleDelete = async () => {
        if (selectedId !== null) {
            await axios.delete(`${fetchUrl}/${selectedId}`);
            setData(data.filter((item) => item.id !== selectedId));
            setShowConfirm(false);
        }
    };

    const promptDelete = (id: any) => {
        setSelectedId(id);
        setShowConfirm(true);
    };

    const handleEmail = (id: any) => {
        // Pastikan data jamaah sudah tersedia
        const jamaah = data.find((j) => j.id === id);  // Mengambil data dari state data yang sudah di-fetch
        
        if (!jamaah || !jamaah.email) {
            console.error("Jamaah atau email tidak ditemukan");
            return;
        }
        
        // Membuat subjek dan pesan email
        const subject = encodeURIComponent(`Halo, ${jamaah.nama_pengirim}`);
        const body = encodeURIComponent(`Hai ${jamaah.nama_pengirim},\n\nIni adalah pesan untuk Anda.`);
    
        // Membuat link email (mailto)
        const mailtoLink = `mailto:${jamaah.email}?subject=${subject}&body=${body}`;
        
        // Membuka aplikasi email dengan link mailto
        window.location.href = mailtoLink;
    };

    const capitalizeFirstLetter = (value: any, accessor: string) => {
        if (typeof value === 'string' && accessor !== 'email') {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    };

    // Function to truncate text content with a given character limit
    const truncateContent = (text: string, limit: number = 50) => {
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    };

    if (loading) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.message}</p>;
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
                                {capitalizeFirstLetter(column.header, column.accessor)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, idxData) => (
                        <TableRow key={idxData}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.accessor}
                                    sx={{
                                        padding: '16px',
                                        borderBottom: '1px solid #E0E0E0',
                                    }}
                                >
                                    {column.accessor ? (
                                        // Apply truncation for content that may be too long
                                        column.accessor === 'pesan' ? (
                                            truncateContent(row[column.accessor])
                                        ) : (
                                            capitalizeFirstLetter(row[column.accessor], column.accessor)
                                        )
                                    ) : (
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<BiTrash />}
                                                onClick={() => promptDelete(row.id)}
                                            >
                                                Hapus
                                            </Button>

                                            <Link href={`/pesan-pengaduan/${row.id}`}>
                                                <Button
                                                    variant="contained"
                                                    sx={{ backgroundColor: '#2379DC', color: 'white', marginLeft: '8px' }}
                                                    startIcon={<AiOutlineEye />}
                                                >
                                                    Detail
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#25D366", color: "white", marginLeft: "8px" }}
                                                onClick={() => handleEmail(row.id) }
                                            >
                                                <AiOutlineMail style={{fontSize: "20px", marginRight: "8px" }} />
                                                Email
                                            </Button>
                                        </Box>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default DataTable;
