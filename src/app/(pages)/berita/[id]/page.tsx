/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Typography, Button, Box, Grid, Divider, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, TextareaAutosize } from "@mui/material";
import { SlActionUndo, SlPencil } from "react-icons/sl";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axios from '@/utils/axios';
import fetchWithAuth from "@/utils/fetch";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface Article {
    judul: string;
    konten: string;
    tanggal_publikasi: string;
    kategori: string;
    status: string;
    foto: string;
}

const ArticleDetailPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';

    const router = useRouter();

    const editor = useRef(null);
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(isEditMode);
    const [error, setError] = useState<string>("");

    const [content, setContent] = useState<string>("");
    const [fotoUrl, setFotoUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<{
        judul: string;
        tanggal_publikasi: string;
        kategori: string;
        status: string;
        foto: File | null;
    }>({
        judul: "",
        tanggal_publikasi: "",
        kategori: "berita",
        status: "published",
        foto: null,
    });

    useEffect(() => {
        fetchArticleData();
    }, [id]);

    const fetchArticleData = () => {
        setLoading(true);
        fetchWithAuth(`http://localhost:8000/api/berita/${id}`)   
            .then((data) => {
                if (!data) {
                    notFound();
                }
                setArticle(data);
                setFormData({
                    judul: data.judul,
                    tanggal_publikasi: data.tanggal_publikasi,
                    kategori: data.kategori,
                    status: data.status,
                    foto: null,
                });
                setContent(data.konten);
                setLoading(false);
                const getFotoUrl = `http://localhost:8000/storage/${data.foto}`;
                setFotoUrl(getFotoUrl);
            })
            .catch((err) => {
                console.error('Error loading article:', err); 
                setError("Failed to load article.");
                setLoading(false);
            });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (formData.foto) {
                await handleFotoUpload(formData.foto);
            }

            const formattedTanggal = formatTanggal(formData.tanggal_publikasi);

            const data = {
                judul: formData.judul,
                tanggal_publikasi: formattedTanggal,
                konten: content,
                status: formData.status,
                kategori: formData.kategori,
            };

            await axios.put(`/berita/${id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            fetchArticleData();

            setIsEditing(false);
            router.push(`/berita/${id}`);
        } catch (error) {
            console.error('Error updating article:', error);
        }
    };

    const handleFotoUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("foto", file);

        try {
            await axios.post(`/berita/${id}/upload-foto`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.error("Error uploading foto:", error);
        }
    };

    const formatTanggal = (tanggal: string): string => {
        const formatted = tanggal.includes('T') ? tanggal.replace('T', ' ') : tanggal;
        return formatted.split(':').slice(0, 2).join(':');
    };

    const handleKembali = () => {
        router.push(`/berita`);
    };

    const handleEdit = () => {
        setIsEditing(true);
        router.push(`/berita/${id}?edit=true`);
    };

    const handleCancel = () => {
        setIsEditing(false);
        router.push(`/berita/${id}`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({ ...formData, foto: e.target.files[0] });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                    {isEditing ? 'Edit Berita' : 'Detail Berita'}
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

            <Box sx={{ padding: "20px", margin: "0 auto" }}>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ marginBottom: "20px" }}>
                            <label>Judul</label>
                            <TextareaAutosize
                                minRows={2}
                                placeholder="Masukkan Judul"
                                value={formData.judul}
                                name="judul"
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '16px',
                                    marginBottom: '15px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                }}
                            />
                            <div style={{ marginBottom: "15px" }}>
                                <label>Konten</label>
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    onBlur={newContent => setContent(newContent)}
                                    onChange={newContent => setContent(newContent)}
                                />
                            </div>

                            <TextField
                                label="Tanggal Publikasi"
                                type="datetime-local"
                                value={formData.tanggal_publikasi}
                                name="tanggal_publikasi"
                                onChange={handleChange}
                                fullWidth
                                sx={{ marginBottom: "15px" }}
                            />

                            {/* Kategori Select */}
                            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    value={formData.kategori}
                                    onChange={handleSelectChange}
                                    name="kategori"
                                    label="Kategori"
                                >
                                    <MenuItem value="berita">Berita</MenuItem>
                                    <MenuItem value="sport">Sport</MenuItem>
                                    <MenuItem value="teknologi">Teknologi</MenuItem>
                                    <MenuItem value="pendidikan">Pendidikan</MenuItem>
                                    <MenuItem value="lainnya">Lainnya</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Status Select */}
                            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    onChange={handleSelectChange}
                                    name="status"
                                    label="Status"
                                >
                                    <MenuItem value="draft">Draft</MenuItem>
                                    <MenuItem value="published">Published</MenuItem>
                                    <MenuItem value="archieved">Archieved</MenuItem>
                                </Select>
                            </FormControl>

                            <div style={{ marginBottom: "15px" }}>
                                <label>Foto</label>
                                {fotoUrl && (
                                    <Image
                                        src={fotoUrl}
                                        alt="Pratinjau Foto"
                                        layout="intrinsic"
                                        width={400}
                                        height={250}
                                        style={{
                                            marginBottom: '5px',
                                            objectFit: 'contain',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                        }}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    width: '100%',
                                    backgroundColor: '#14B8A6', 
                                    '&:hover': {
                                        backgroundColor: '#14B8A6', 
                                    },
                                }}
                            >
                                Update Berita
                            </Button>

                        </Box>

                    </form>
                ) : (
                    <>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
                            {article?.judul}
                        </Typography>

                        {/* Foto Image */}
                        {article?.foto && (
                            <Box sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                maxWidth: "100%",
                                width: "100%",
                            }}>
                                <Image
                                    src={`http://localhost:8000/storage/${article.foto}`}
                                    alt={article?.judul}
                                    width={500}
                                    height={500}
                                    layout="intrinsic"
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            </Box>
                        )}

                        {/* Article Content */}
                        <div
                            dangerouslySetInnerHTML={{ __html: article?.konten || "" }}
                            style={{
                                marginBottom: "20px",
                            }}
                        />

                        <Box
                            sx={{
                                borderBottom: "2px solid #696969",
                                marginBottom: "20px"
                            }}
                        />

                        {/* Article Metadata */}
                        <Box sx={{ marginBottom: "20px", padding: "20px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body1" fontWeight="bold">Tanggal Publikasi</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="body1">: {article?.tanggal_publikasi}</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", marginY: "10px" }} />
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body1" fontWeight="bold">Kategori</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="body1">: {article?.kategori}</Typography>
                                </Grid>
                                <Divider sx={{ width: "100%", marginY: "10px" }} />
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="body1" fontWeight="bold">Status</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography variant="body1">: {article?.status}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </Box>
        </DefaultLayout>
    );
};

export default ArticleDetailPage;
