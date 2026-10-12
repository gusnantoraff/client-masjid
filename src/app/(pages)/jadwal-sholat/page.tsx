"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Button, Box, Typography } from "@mui/material";
import JadwalSholat2 from '@/components/LandingPage/JadwalSholat2';
import { useState } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import Modal from '@/components/Modal/ModalHariBesar';
import ListHariBesar from '@/components/HariBesarComponent/ListHariBesar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function JadwalSholat() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshList, setRefreshList] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = () => {
        setRefreshList(prev => !prev);
        closeModal();
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
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: '600', fontFamily: 'Nunito Sans' }}
                >
                    Hari Besar
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#14B8A6', color: 'white', marginRight: '10px' }}
                        startIcon={<AiOutlinePlus />}
                        onClick={openModal}
                    >
                        Tambah Data
                    </Button>
                </Box>
                </Box>
                <Modal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} onSuccess={(message: string) => toast.success(message)}/>
                <ListHariBesar refresh={refreshList} />
                <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar={false} />
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
                        marginTop: "20px"
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: '600', fontFamily: 'Nunito Sans' }}
                    >
                        Jadwal Sholat
                    </Typography>
                </Box>
                <Box marginTop="20px">
                    <JadwalSholat2 />
                </Box>
        </DefaultLayout>
    );
};


