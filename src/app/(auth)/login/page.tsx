/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import styles from '@/styles/LoginPage.module.css';
import InputField from './InputField';
import { useRouter } from 'next/navigation';
import { FaRegUser } from 'react-icons/fa';
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
        const response = await fetch('https://backend-masjid-production.up.railway.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }

        const data = await response.json();
        localStorage.setItem('api_token', data.token);
        router.push('/dashboard');
    } catch (error: any) {
        setErrorMessage(error.message || 'An error occurred during login.');
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
              <form className={styles.formInner} onSubmit={handleLogin}>
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Masukan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<FaRegUser/>}
                />
                <InputField
                  label="Kata Sandi"
                  type="password"
                  placeholder="Masukan Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                <a href="/lupa-sandi" className={styles.forgotPassword}>Lupa Kata Sandi?</a>
                <button type="submit" className={styles.loginButton} disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Login'}
                </button>
                <p className={styles.signupPrompt}>
                  Belum Punya Akun? <a href="/register" className={styles.signupLink}>Daftar</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;