'use client';
import React, { useState } from 'react';
import styles from '@/styles/LoginPage.module.css';
import InputField from '@/app/(auth)/login/InputField';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaRegEnvelope } from 'react-icons/fa6';

const ForgotPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://backend-masjid-production.up.railway.app/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed. Please check your Email!');
      }

      const data = await response.json();
      console.log('Verify successful:', data);

      setSuccessMessage('Email untuk reset password berhasil dikirim! Silakan periksa email Anda.');
      setEmail('');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during verify.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.loginContainer}>
       <div className={styles.contentWrapper}>
        <section className={styles.imageColumn}>
          <Image src="/images/masjid.jpg" alt="Login illustration" className={styles.loginImage} priority={false} width={736} height={1104}/>
        </section>
        <section className={styles.formColumn}>
          <div className={styles.formWrapper}>
            <Image src="/images/logo.png" alt="Company logo" className={styles.logo} priority={false} width={207} height={75}/>
            <div className={styles.formContainer}>
              <form className={styles.formInner} onSubmit={handleForgot}>
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Masukan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaRegEnvelope />}
                />
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                <button type="submit" className={styles.loginButton} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Kirim Email'}
                </button>
                <p className={styles.signupPrompt}>
                  <a href="/login" className={styles.signupLink}>Kembali</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPage;
