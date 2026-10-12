/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef } from 'react';
import axios from '@/utils/axios';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


interface ArticleFormProps {
  onSubmit: () => void;
}

export default function ArticleForm({ onSubmit }: ArticleFormProps) {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    judul: '',
    tanggal_publikasi: '',
    kategori: 'berita',
    status: 'published',
    foto: null as File | null
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prevData) => ({
      ...prevData,
      foto: file || null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    data.append('judul', formData.judul);
    data.append('tanggal_publikasi', formattedDate);
    data.append('kategori', formData.kategori);
    data.append('status', formData.status);
    data.append('konten', content);

    if (formData.foto) {
      data.append('foto', formData.foto);
    }

    setLoading(true);

    try {
      const response = await axios.post('/berita', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from API:', response.data);
      setFormData(initialFormData);
      setContent('');
      onSubmit();
    } catch (error) {
      console.error('Error posting data:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.formBody}>

          {/* Left Column */}
          <div style={styles.leftColumn}>

            <div style={styles.formGroup}>
              <label htmlFor="judul" style={styles.label}>Judul</label>
              <textarea
                id="judul"
                name="judul"
                placeholder="Masukan Judul"
                value={formData.judul}
                onChange={handleChange}
                rows={2}
                style={styles.textarea}
              />
            </div>

            {/* Content Editor */}
            <div style={styles.formGroup}>
              <label htmlFor="konten" style={styles.label}>Konten</label>
              <JoditEditor
                ref={editor}
                value={content}
                onBlur={newContent => setContent(newContent)}
                onChange={newContent => setContent(newContent)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>

            {/* Category Dropdown */}
            <div style={styles.formGroup}>
              <label htmlFor="kategori" style={styles.label}>Kategori</label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                style={styles.input}
              >
                <optgroup label="Pilih Kategori">
                  <option value="berita">Berita</option>
                  <option value="sport">Sport</option>
                  <option value="teknologi">Teknologi</option>
                  <option value="pendidikan">Pendidikan</option>
                  <option value="lainnya">Lainnya</option>
                </optgroup>
              </select>
            </div>

            {/* Status Dropdown */}
            <div style={styles.formGroup}>
              <label htmlFor="status" style={styles.label}>Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Image Upload */}
            <div style={styles.formGroup}>
              <label htmlFor="foto" style={styles.label}>Foto</label>
              <input
                type="file"
                id="foto"
                name="foto"
                onChange={handleFileChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Footer with Submit Button */}
        <div style={styles.footer}>
          <button type="submit" style={styles.saveButton}>
            {loading ? 'Loading...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 'full',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formBody: {
    display: 'flex',
    gap: '20px',
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 400,
    color: '#000',
    fontSize: '16px',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'vertical',
  },
  saveButton: {
    backgroundColor: '#14B8A6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
};
