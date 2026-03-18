import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

export default function OwnerDashboard() {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'cashier'
  })

  useEffect(() => {
    fetchUsers()
    fetchOrders()
    fetchProducts()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editUser) {
        await api.put(`/users/${editUser.id}`, form)
        setMessage('User berhasil diupdate!')
      } else {
        await api.post('/users', form)
        setMessage('User berhasil ditambahkan!')
      }
      setShowForm(false)
      setEditUser(null)
      setForm({ name: '', email: '', password: '', role: 'cashier' })
      fetchUsers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menyimpan user')
    }
  }

  const handleEdit = (user) => {
    setEditUser(user)
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus user ini?')) return
    try {
      await api.delete(`/users/${id}`)
      setMessage('User berhasil dihapus!')
      fetchUsers()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menghapus user')
    }
  }

  const handleExport = async () => {
    try {
      const res = await api.get('/exports/sales', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'sales.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error(err)
    }
  }

  // Hitung total pendapatan
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0)

  return (
    <div>
      <Navbar />
      <div style={styles.container}>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>👥</div>
            <div style={styles.summaryNumber}>{users.length}</div>
            <div style={styles.summaryLabel}>Total Staff</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>🍵</div>
            <div style={styles.summaryNumber}>{products.length}</div>
            <div style={styles.summaryLabel}>Total Produk</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>📋</div>
            <div style={styles.summaryNumber}>{orders.length}</div>
            <div style={styles.summaryLabel}>Total Order</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>💰</div>
            <div style={styles.summaryNumber}>
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div style={styles.summaryLabel}>Total Pendapatan</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'users' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('users')}
          >
            👥 Kelola Staff
          </button>
          <button
            style={activeTab === 'orders' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('orders')}
          >
            📋 Laporan Order
          </button>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        {/* Tab Users */}
        {activeTab === 'users' && (
          <div>
            <div style={styles.header}>
              <h3>Daftar Staff</h3>
              <button style={styles.addBtn} onClick={() => {
                setShowForm(!showForm)
                setEditUser(null)
                setForm({ name: '', email: '', password: '', role: 'cashier' })
              }}>
                + Tambah Staff
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div style={styles.form}>
                <h4>{editUser ? 'Edit Staff' : 'Tambah Staff Baru'}</h4>
                <div style={styles.formGrid}>
                  <input
                    placeholder="Nama"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    placeholder={editUser ? "Password baru (kosongkan jika tidak diubah)" : "Password"}
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={styles.input}
                  />
                  <select
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    style={styles.input}
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <button onClick={handleSubmit} style={styles.saveBtn}>
                  {editUser ? 'Update' : 'Simpan'}
                </button>
              </div>
            )}

            {/* Tabel Users */}
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: user.role === 'owner' ? '#3d2b1f' : user.role === 'manager' ? '#f0a500' : '#2d7a2d'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(user)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDelete(user.id)} style={styles.deleteBtn}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Orders */}
        {activeTab === 'orders' && (
          <div>
            <div style={styles.header}>
              <h3>Laporan Order</h3>
              <button onClick={handleExport} style={styles.exportBtn}>
                📥 Export CSV
              </button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Kasir</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td style={styles.td}>#{order.id}</td>
                    <td style={styles.td}>{order.cashier_name}</td>
                    <td style={styles.td}>Rp {parseInt(order.total).toLocaleString('id-ID')}</td>
                    <td style={styles.td}>{order.status}</td>
                    <td style={styles.td}>{new Date(order.created_at).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  container: { padding: '24px', backgroundColor: '#f5f0eb', minHeight: 'calc(100vh - 50px)' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  summaryCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  summaryIcon: { fontSize: '28px', marginBottom: '8px' },
  summaryNumber: { fontSize: '24px', fontWeight: 'bold', color: '#3d2b1f' },
  summaryLabel: { fontSize: '12px', color: '#888', marginTop: '4px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#ddd' },
  tabActive: { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#3d2b1f', color: 'white' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  addBtn: { padding: '8px 16px', backgroundColor: '#3d2b1f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  exportBtn: { padding: '8px 16px', backgroundColor: '#2d7a2d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  input: { padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
  saveBtn: { padding: '8px 20px', backgroundColor: '#2d7a2d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden' },
  tableHeader: { backgroundColor: '#3d2b1f', color: 'white' },
  tableRow: { borderBottom: '1px solid #eee' },
  th: { padding: '12px 16px', textAlign: 'left' },
  td: { padding: '12px 16px' },
  roleBadge: { color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' },
  editBtn: { padding: '4px 10px', backgroundColor: '#f0a500', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
  deleteBtn: { padding: '4px 10px', backgroundColor: '#cc4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  message: { backgroundColor: '#e0ffe0', color: '#2d7a2d', padding: '10px', borderRadius: '6px', marginBottom: '16px' }
}