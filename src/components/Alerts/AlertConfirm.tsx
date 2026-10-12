import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Peringatan</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Batal
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Konfirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
