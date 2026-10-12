'use client';
import React, { useState } from 'react';
import styles from '@/styles/LoginPage.module.css';
import InputField from '@/app/(auth)/login/InputField';
import { useRouter } from 'next/navigation';
import { FaRegUser } from 'react-icons/fa';
import { FaRegEnvelope } from 'react-icons/fa6';
import Image from 'next/image';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password_confirmation, setPasswordConfirm] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (password !== password_confirmation) {
      setErrorMessage('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, email, password, password_confirmation }),
      });

      if (!response.ok) {
        throw new Error('Register failed. Please check your credentials.');
      }

      const data = await response.json();
      console.log('Register successful:', data);
      router.push('/login');
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred during register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.regisContainer}>
      <div className={styles.contentWrapper}>
        <section className={styles.imageColumn}>
          <Image src="/images/masjid.jpg" alt="Login illustration" className={styles.loginImage} priority={false} width={736} height={1104}/>
        </section>
        <section className={styles.formColumn}>
          <div className={styles.formWrapperRegis}>
            <Image src="/images/logo.png" alt="Company logo" className={styles.logo} priority={false} width={207} height={75}/>
            <div className={styles.formContainer}>
              <form className={styles.formInner} onSubmit={handleLogin}>
                <InputField
                  label="Nama Depan"
                  type="text"
                  placeholder="Masukan Nama Depan"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  icon={<FaRegUser />}
                />
                <InputField
                  label="Nama Belakang"
                  type="text"
                  placeholder="Masukan Nama Belakang"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  icon={<FaRegUser />}
                />
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Masukan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaRegEnvelope />}
                />
                <InputField
                  label="Buat Kata Sandi"
                  type="password"
                  placeholder="Buat Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputField
                  label="Konfirmasi Kata Sandi"
                  type="password"
                  placeholder="Konfirmasi Kata Sandi"
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <button type="submit" className={styles.loginButton} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Register'}
                </button>
                <p className={styles.signupPrompt}>
                  Sudah Punya Akun? <a href="/login" className={styles.signupLink}>Masuk</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
