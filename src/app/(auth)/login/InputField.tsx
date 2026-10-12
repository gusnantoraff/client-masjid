"use client";
import React, { useState, ReactNode } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import styles from '@/styles/LoginPage.module.css';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, placeholder, value, onChange, icon }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel} htmlFor={`${label.toLowerCase()}Input`}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <div className={`${styles.inputField} ${type === 'password' ? styles.iconRight : styles.iconLeft}`}>
         
          {type !== 'password' && icon && <span className={styles.inputIcon}>{icon}</span>}
          {type === 'password' ? (
            <>
              <input
                type={showPassword ? 'text' : 'password'}
                id={`${label.toLowerCase()}Input`}
                placeholder={placeholder}
                className={styles.inputPlaceholder}
                value={value}
                onChange={onChange}
                aria-label={label}
              />
              {showPassword ? (
                <FaRegEyeSlash className={styles.inputIcon} onClick={togglePasswordVisibility} />
              ) : (
                <FaRegEye className={styles.inputIcon} onClick={togglePasswordVisibility} />
              )}
            </>
          ) : (
            <input
              type={type}
              id={`${label.toLowerCase()}Input`}
              placeholder={placeholder}
              className={styles.inputPlaceholder}
              value={value}
              onChange={onChange}
              aria-label={label}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;
