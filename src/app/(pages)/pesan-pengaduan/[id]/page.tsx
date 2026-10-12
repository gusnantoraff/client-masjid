"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Typography, Button, Box, Grid, Divider } from "@mui/material";
import { SlActionUndo } from "react-icons/sl";
import { FiVolume2 } from 'react-icons/fi';
import { AiOutlineMail } from "react-icons/ai";
import axios from '@/utils/axios';
import fetchWithAuth from "@/utils/fetch";

interface Pesan {
    nama_pengirim: string;
    email: string;
    pesan: string;
    tanggal: string;
}

const PesanDetail = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [pesan, setPesan] = useState<Pesan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetchWithAuth(`http://localhost:8000/api/pesan-website/${id}`)
            .then((data) => {
                if (!data) {
                    notFound();
                }
                setPesan(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load message.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <Typography variant="h6" sx={{ padding: "20px" }}>Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" sx={{ padding: "20px" }}>{error}</Typography>;
    }

    const handleEmail = () => {
        if (!pesan || !pesan.email) {
            console.error("Pesan or email not found");
            return;
        }

        // Create subject and body for the email
        const subject = encodeURIComponent(`Halo, ${pesan.nama_pengirim}`);
        const body = encodeURIComponent(`Hai ${pesan.nama_pengirim},\n\nIni adalah pesan untuk Anda.`);

        // Create mailto link
        const mailtoLink = `mailto:${pesan.email}?subject=${subject}&body=${body}`;

        // Open mail client with mailto link
        window.location.href = mailtoLink;
    };


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
                    Detail
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.history.back()}
                    startIcon={<SlActionUndo />}
                >
                    Kembali
                </Button>
            </Box>

            <div style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "24px",
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.08)",
                marginBottom: "24px",
                maxWidth: "full",
                overflowWrap: "break-word",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                position: "relative",
            }}>
                {/* Icon on the Left */}
                <div style={{
                    marginRight: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#ffcc4d",
                }}>
                    <FiVolume2 size={24} color="#333" /> {/* Speaker icon */}
                </div>

                {/* Message Content */}
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#333",
                        margin: "0 0 12px 0",
                        letterSpacing: "0.5px",
                    }}
                    >
                        Pesan & Pengaduan</h2>

                    <div
                        dangerouslySetInnerHTML={{ __html: pesan?.pesan || "" }}
                        style={{
                            color: "#4a4a4a",
                            fontSize: "16px",
                            lineHeight: "1.6",
                        }}
                    />

                    {/* Decorative Separator */}
                    <div style={{
                        marginTop: "16px",
                        borderTop: "1px dashed #e0e0e0",
                        width: "100%",
                        height: "1px",
                    }}></div>
                </div>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#25D366",
                        color: "white",
                        marginLeft: "18px", 
                        height: "40px", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={handleEmail}
                >
                    <AiOutlineMail style={{ fontSize: "20px", marginRight: "8px" }} />
                    Balas Pesan Sekarang
                </Button>
            </div>

            {/* Horizontal Divider */}
            <Box
                sx={{
                    borderBottom: "2px solid #e0e0e0",
                    marginBottom: "20px"
                }}
            />

            {/* Sender Details Container */}
            <Box sx={{
                marginBottom: "20px",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e5e5e5",
                backgroundColor: "#f7f7f7",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)"
            }}>
                <Grid container spacing={2}>
                    {/* Nama Pengirim */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body1" fontWeight="bold" color="#333">Nama Pengirim</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" color="#4a4a4a">: {pesan?.nama_pengirim}</Typography>
                    </Grid>

                    <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

                    {/* Email */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body1" fontWeight="bold" color="#333">Email</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" color="#4a4a4a">: {pesan?.email}</Typography>
                    </Grid>

                    <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

                    {/* Tanggal Pengirim */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="body1" fontWeight="bold" color="#333">Tanggal Pengirim</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Typography variant="body1" color="#4a4a4a">: {pesan?.tanggal}</Typography>
                    </Grid>
                </Grid>
            </Box>

        </DefaultLayout>
    );
}

export default PesanDetail;
