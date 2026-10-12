import React from "react";
import { Modal, Box, Typography, Divider, Card, CardMedia, CardContent, Button } from "@mui/material";

interface DetailModalProps {
    open: boolean;
    selectedDetail: any;
    onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ open, selectedDetail, onClose }) => {

    const imageUrl = selectedDetail?.foto ? `http://localhost:8000/storage/${selectedDetail.foto}` : '';

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: '80%',
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    {selectedDetail?.judul}
                </Typography>

                {/* Foto Image */}
                {selectedDetail?.foto && (
                    <Card sx={{ marginBottom: 2 }}>
                        <CardMedia
                            component="img"
                            height="400"
                            image={imageUrl}
                            alt={selectedDetail?.judul}
                            sx={{ objectFit: 'contain', width: '100%' }}
                        />
                    </Card>
                )}

                {/* Konten (HTML content) */}
                <Box
                    sx={{
                        marginBottom: 2,
                        fontSize: '16px',
                        lineHeight: '1.6',
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedDetail?.konten || "" }}
                />

                <Divider sx={{ marginBottom: 2 }} />

                {/* Article Details */}
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Tanggal Publikasi:</Typography>
                    <Typography variant="body2">{selectedDetail?.tanggal_publikasi}</Typography>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Kategori:</Typography>
                    <Typography variant="body2">{selectedDetail?.kategori}</Typography>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Status:</Typography>
                    <Typography variant="body2">{selectedDetail?.status}</Typography>
                </Box>

                {/* Close Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    sx={{ alignSelf: 'flex-end' }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default DetailModal;
