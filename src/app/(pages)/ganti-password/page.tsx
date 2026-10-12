'use client';

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Box, Typography, TextField, Button, Grid, IconButton } from "@mui/material";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { SlActionUndo } from "react-icons/sl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const GantiPassword = () => {
  const [current_password, setOldPassword] = useState<string>("");
  const [new_password, setNewPassword] = useState<string>("");
  const [password_confirmation, setConfirmPassword] = useState<string>("");
  const [validation, setValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const token = localStorage.getItem('api_token');


  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);

    setValidation({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate passwords match
    if (new_password !== password_confirmation) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    // Ensure password passes validation rules
    if (!Object.values(validation).every(Boolean)) {
      setErrorMessage('Password baru tidak memenuhi semua aturan!');
      return;
    }

    try {
      setIsLoading(true);

      await axios.post('http://localhost:8000/api/change-password', {
        current_password,
        new_password,
        password_confirmation,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true, 
      });

      setSuccessMessage('Password berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan saat mengganti password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#EDF1F8",
          color: "black",
          borderRadius: "10px",
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "600", fontFamily: "Nunito Sans" }}
        >
          Ganti Kata Sandi
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

      {/* Form */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: "30px",
          backgroundColor: "white",  // Background color set to white
          borderRadius: "10px",
          maxWidth: "1000px",
          width: "100%",
          margin: "50px auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",  // Added shadow for separation
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: "600", fontFamily: "Nunito Sans", textAlign: "center" }}
        >
          Ganti Kata Sandi
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="center">
            {/* Checklist Validasi */}
            <Grid item xs={6}>
              <Typography
                variant="h6"  // Increased font size
                sx={{
                  marginBottom: "10px",
                  fontWeight: 500,
                  fontSize: "18px",  // Increased font size
                }}
              >
                Kata sandi harus memenuhi:
              </Typography>
              <Box>
                <Typography
                  variant="body1"  // Increased font size
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: validation.length ? "green" : "gray",
                    fontSize: "16px",  // Increased font size
                  }}
                >
                  <CheckIcon sx={{ marginRight: "8px", color: validation.length ? "green" : "gray" }} />
                  Minimal 6 karakter
                </Typography>
                <Typography
                  variant="body1"  // Increased font size
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: validation.uppercase ? "green" : "gray",
                    fontSize: "16px",  // Increased font size
                  }}
                >
                  <CheckIcon sx={{ marginRight: "8px", color: validation.uppercase ? "green" : "gray" }} />
                  Minimal 1 huruf besar (A-Z)
                </Typography>
                <Typography
                  variant="body1"  // Increased font size
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: validation.lowercase ? "green" : "gray",
                    fontSize: "16px",  // Increased font size
                  }}
                >
                  <CheckIcon sx={{ marginRight: "8px", color: validation.lowercase ? "green" : "gray" }} />
                  Minimal 1 huruf kecil (a-z)
                </Typography>
                <Typography
                  variant="body1"  // Increased font size
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: validation.number ? "green" : "gray",
                    fontSize: "16px",  // Increased font size
                  }}
                >
                  <CheckIcon sx={{ marginRight: "8px", color: validation.number ? "green" : "gray" }} />
                  Minimal 1 angka (0-9)
                </Typography>
              </Box>
            </Grid>

            {/* Input Fields */}
            <Grid item xs={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Kata sandi lama"
                  type={showOldPassword ? "text" : "password"}
                  value={current_password}
                  onChange={(e) => setOldPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  label="Kata sandi baru"
                  type={showNewPassword ? "text" : "password"}
                  value={new_password}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
                <TextField
                  label="Konfirmasi kata sandi baru"
                  type={showConfirmPassword ? "text" : "password"}
                  value={password_confirmation}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3, marginTop: "20px" }}> {/* Added marginTop for spacing */}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: '#14B8A6', color: 'white', width: '15%' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Simpan'}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#F97F30",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#F67D27",
                    },
                    width: '15%',
                  }}
                  onClick={() => {
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setValidation({
                      length: false,
                      uppercase: false,
                      lowercase: false,
                      number: false,
                    });
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Batal
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {errorMessage && <Typography sx={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Typography>}
        {successMessage && <Typography sx={{ color: 'green', textAlign: 'center' }}>{successMessage}</Typography>}
      </Box>
    </DefaultLayout>
  );
};

export default GantiPassword;
