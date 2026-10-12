"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Button, Box, Typography } from "@mui/material";
import JadwalSholat2 from '@/components/LandingPage/JadwalSholat2';
import { useState } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import ListHariBesar from '@/components/HariBesarComponent/ListHariBesar'
import EditKegiatan from "@/components/EditModal/ModalKegiatan";
import { useRouter } from "next/navigation";

const JadwalSholatPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [refreshList, setRefreshList] = useState(false);

    const router = useRouter();

    const handleModalClose = () => {
        router.push(`/jadwal-sholat`);
        setIsModalOpen(false);
    };

    const handleModalSubmit = () => {
        router.push(`/jadwal-sholat`);
        setRefreshList(prev => !prev);
        setIsModalOpen(false);
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
                    >
                        Tambah Data
                    </Button>
                </Box>
            </Box>
            {isModalOpen && (
                <EditKegiatan
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleModalSubmit}
                    id={id}
                />
            )}
            <ListHariBesar refresh={refreshList} />
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

export default JadwalSholatPage;



