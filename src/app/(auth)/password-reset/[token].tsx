'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/LoginPage.module.css';

const PasswordResetPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mereset password. Silakan coba lagi.');
      }

      const data = await response.json();
      console.log('Password reset successful:', data);
      setSuccessMessage('Password berhasil direset. Anda dapat login sekarang.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.resetContainer}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Reset Password</h1>
        <form className={styles.formContainer} onSubmit={handlePasswordReset}>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">Password Baru</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
          <button type="submit" className={styles.resetButton} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PasswordResetPage;
