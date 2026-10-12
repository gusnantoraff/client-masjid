"use client";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Typography, Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { SlActionUndo, SlPencil } from "react-icons/sl";
import axios from '@/utils/axios';
import { useSearchParams, useRouter } from "next/navigation";

interface Jamaah {
    nama: string;
    gender: string;
    birth: string;
    kontak: string;
    email: string;
    alamat: string;
    keterangan: string;
}

const JamaahPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';

    const router = useRouter();

    const [jamaah, setJamaah] = useState<Jamaah | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(isEditMode);
    const [formData, setFormData] = useState<Jamaah | null>(null);

    useEffect(() => {
        axios
            .get(`/jamaah/${id}`)
            .then((response) => {
                const data = response.data;
                if (!data) {
                    notFound();
                }
                setJamaah(data);
                setFormData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load article.");
                setLoading(false);
            });
    }, [id]);

    const capitalizeFirstLetter = (value: any, accessor: string) => {
        if (typeof value === "string" && accessor !== "email") {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown; }> | SelectChangeEvent<string>
    ) => {
        const { name, value } = e.target;
        if (formData) {
            setFormData({
                ...formData,
                [name as string]: value
            });
        }
    };

    const handleUpdate = () => {
        axios
            .put(`/jamaah/${id}`, formData)
            .then((response) => {
                const data = response.data;
                setJamaah(data);
                setIsEditing(false);
                setLoading(true);
                router.push(`/jamaah/${id}`);
                axios
                    .get(`/jamaah/${id}`)
                    .then((response) => {
                        setJamaah(response.data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setError("Failed to load updated data.");
                        setLoading(false);
                    });
            })
            .catch((err) => {
                setError("Failed to update data.");
            });
    };

    const handleKembali = () => {
        router.push(`/jamaah`);
    };

    const handleEdit = () => {
        setIsEditing(true);
        router.push(`/jamaah/${id}?edit=true`);
    };

    const handleCancel = () => {
        setIsEditing(false);
        router.push(`/jamaah/${id}`);
        setFormData(jamaah);
    };

    if (loading) {
        return <Typography variant="h6" sx={{ padding: "20px" }}>Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" sx={{ padding: "20px" }}>{error}</Typography>;
    }

    return (
        <DefaultLayout>
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
                    width: '100%',
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: '600', fontFamily: 'Nunito Sans' }}
                >
                    {isEditing ? 'Edit Jamaah' : 'Detail Jamaah'}
                </Typography>

                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleKembali}
                        startIcon={<SlActionUndo />}
                        sx={{ marginRight: '10px' }}
                    >
                        Kembali
                    </Button>
                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCancel}
                            startIcon={<SlActionUndo />}
                            sx={{ marginRight: '10px' }}
                        >
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#14B8A6',
                                color: 'white',
                            }}
                            onClick={handleEdit}
                            startIcon={<SlPencil />}
                        >
                            Edit
                        </Button>
                    )}
                </Box>
            </Box>

            <Box
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    marginBottom: "20px"
                }}
            />
            <Box sx={{ width: '100%', overflowX: 'auto', border: '2px solid #e0e0e0', borderRadius: '10px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="jamaah detail">
                    <TableBody className="border-1">
                        <TableRow sx={{ backgroundColor: '#EDF1F8' }}>
                            <TableCell component="th" scope="row">Nama Jamaah</TableCell>
                            <TableCell>{isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="nama"
                                    value={formData?.nama || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                `: ${capitalizeFirstLetter(jamaah?.nama, "nama")}`
                            )}</TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#ffffff' }}>
                            <TableCell component="th" scope="row">Jenis Kelamin</TableCell>
                            <TableCell>{isEditing ? (
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Jenis Kelamin</InputLabel>
                                    <Select
                                        label="Jenis Kelamin"
                                        name="gender"
                                        value={formData?.gender || ''}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="pria">Pria</MenuItem>
                                        <MenuItem value="wanita">Wanita</MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                `: ${capitalizeFirstLetter(jamaah?.gender, "gender")}`
                            )}</TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#EDF1F8' }}>
                            <TableCell component="th" scope="row">Tanggal Lahir</TableCell>
                            <TableCell>{isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="birth"
                                    type="date"
                                    value={formData?.birth || ''}
                                    onChange={handleInputChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            ) : (
                                `: ${capitalizeFirstLetter(jamaah?.birth, "birth")}`
                            )}</TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#ffffff' }}>
                            <TableCell component="th" scope="row">Kontak</TableCell>
                            <TableCell>{isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="kontak"
                                    value={formData?.kontak || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                `: ${capitalizeFirstLetter(jamaah?.kontak, "kontak")}`
                            )}</TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#EDF1F8' }}>
                            <TableCell component="th" scope="row">Email</TableCell>
                            <TableCell>{isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="email"
                                    value={formData?.email || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                `: ${jamaah?.email}`
                            )}</TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#ffffff' }}>
                            <TableCell component="th" scope="row">Alamat</TableCell>
                            <TableCell>{isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    name="alamat"
                                    value={formData?.alamat || ''}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                `: ${capitalizeFirstLetter(jamaah?.alamat, "alamat")}`
                            )}</TableCell>
                        </TableRow>

                        <TableRow sx={{ backgroundColor: '#EDF1F8' }}>
                            <TableCell component="th" scope="row">Keterangan</TableCell>
                            <TableCell>{isEditing ? (
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Keterangan</InputLabel>
                                    <Select
                                        label="Keterangan"
                                        name="keterangan"
                                        value={formData?.keterangan || ''}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="aktif">Aktif</MenuItem>
                                        <MenuItem value="pindah">Pindah</MenuItem>
                                        <MenuItem value="wafat">Wafat</MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                `: ${capitalizeFirstLetter(jamaah?.keterangan, "keterangan")}`
                            )}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {isEditing && (
                    <Box sx={{ marginTop: '20px', textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            onClick={handleUpdate}
                            sx={{
                                backgroundColor: '#14B8A6',
                                color: 'white',
                                margin: '10px'
                            }}>
                            Update
                        </Button>
                    </Box>
                )}
            </Box>
        </DefaultLayout>
    );
};
export default JamaahPage;
