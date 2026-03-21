import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Setup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Cek apakah setup sudah dilakukan
    checkSetup()
  }, [])

  const checkSetup = async () => {
    try {
      const res = await api.get('/auth/check-setup')
      if (res.data.setupDone) {
        navigate('/login') // Sudah ada owner, redirect ke login
      }
    } catch (err) {
      console.error(err)
    } finally {
      setChecking(false)
    }
  }

  const handleSetup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/setup', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Setup gagal')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return <div style={styles.loading}>Memeriksa...</div>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>☕ Setup Awal</h2>
        <p style={styles.subtitle}>Buat akun owner untuk memulai</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSetup}>
          <div style={styles.formGroup}>
            <label>Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Nama owner"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Email owner"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Membuat akun...' : 'Buat Akun Owner'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f0eb' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { textAlign: 'center', color: '#3d2b1f', marginBottom: '8px' },
  subtitle: { textAlign: 'center', color: '#888', marginBottom: '24px' },
  error: { backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  formGroup: { marginBottom: '16px' },
  input: { width: '100%', padding: '10px', marginTop: '6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#3d2b1f', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }
}