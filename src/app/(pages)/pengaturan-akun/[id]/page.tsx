"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Typography, Button, Box, Grid, Divider, Avatar, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import { SlActionUndo, SlPencil } from "react-icons/sl";
import { useSearchParams, useRouter } from "next/navigation";
import fetchWithAuth from "@/utils/fetch";

interface Akun {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birth: string;
  password: string;
  password_confirmation: string;
  gender: string;
  role: string;
  avatar: string | null;
}

const Akun = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const router = useRouter();

  const [akun, setAkun] = useState<Akun | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<Akun | null>(null);

  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/api/users/${id}`)
      .then((data) => {
        if (!data) {
          notFound();
        }
        setAkun(data);
        setFormData(data);  // Set initial form data
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

  const avatarUrl = akun?.avatar
    ? `http://localhost:8000/storage/${akun.avatar}`
    : "/images/user/user.png";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    fetchWithAuth(`http://localhost:8000/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((updatedData) => {

        fetchWithAuth(`http://localhost:8000/api/users/${id}`)
          .then((data) => {
            setAkun(data);
            setIsEditing(false);
            router.push(`/pengaturan-akun/${id}`);
          })
          .catch((err) => setError("Failed to load updated profile."));
      })
      .catch((error) => {
        setError("Failed to update profile.");
      });
  };


  const handleKembali = () => {
    router.push(`/pengaturan-akun`);
  };

  const handleEdit = () => {
    setIsEditing(true);
    router.push(`/pengaturan-akun/${id}?edit=true`);
  };

  const handleCancel = () => {
    setIsEditing(false);
    router.push(`/pengaturan-akun/${id}`);
    setFormData(akun);
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
          {isEditing ? 'Edit User' : 'Detail User'}
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
        {/* Avatar Display */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 100, height: 100 }}
            alt="Profile Picture"
            src={avatarUrl} // Avatar URL
          />
        </Box>

        <Grid container spacing={2}>
          {/* Firstname */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Firstname</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <TextField
                fullWidth
                name="firstname"
                value={formData?.firstname || ""}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.firstname}</Typography>
            )}
          </Grid>

          <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

          {/* Lastname */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Lastname</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <TextField
                fullWidth
                name="lastname"
                value={formData?.lastname || ""}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.lastname}</Typography>
            )}
          </Grid>

          <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

          {/* Email */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Email</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <TextField
                fullWidth
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.email}</Typography>
            )}
          </Grid>

          <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

          {/* Phone */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Kontak</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <TextField
                fullWidth
                name="phone"
                value={formData?.phone || ""}
                onChange={handleChange}
              />
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.phone}</Typography>
            )}
          </Grid>

          <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

          {/* Birthdate (Tanggal Lahir) */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Tanggal Lahir</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <TextField
                fullWidth
                name="birth"
                type="date"
                value={formData?.birth || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }} // Ensures the label shrinks when there's a value
              />
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.birth}</Typography>
            )}
          </Grid>

          <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

          {/* Gender */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Gender</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <FormControl fullWidth>
                <Select
                  name="gender"
                  value={formData?.gender || ""}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.gender}</Typography>
            )}
          </Grid>

          <Divider sx={{ width: "100%", marginY: "10px", backgroundColor: "#e0e0e0" }} />

          {/* Role */}
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" fontWeight="bold" color="#333">Role</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            {isEditing ? (
              <FormControl fullWidth>
                <Select
                  name="role"
                  value={formData?.role || ""}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="PENGURUS_MASJID">Pengurus Masjid</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body1" color="#4a4a4a">: {akun?.role}</Typography>
            )}
          </Grid>
        </Grid>

        {/* Save Button */}
        {isEditing && (
          <Box sx={{ marginTop: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#14B8A6',
                  '&:hover': { backgroundColor: '#14B8A6' },
                }}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>

          </Box>
        )}
      </Box>
    </DefaultLayout>
  );
};

export default Akun;
