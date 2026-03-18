import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

export default function ManagerDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('products')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '', price: '', category: '', stock: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
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

  const handleSubmit = async () => {
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, form)
        setMessage('Produk berhasil diupdate!')
      } else {
        await api.post('/products', form)
        setMessage('Produk berhasil ditambahkan!')
      }
      setShowForm(false)
      setEditProduct(null)
      setForm({ name: '', price: '', category: '', stock: '' })
      fetchProducts()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menyimpan produk')
    }
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    })
    setShowForm(true)
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

  return (
    <div>
      <Navbar />
      <div style={styles.container}>

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'products' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('products')}
          >
            🍵 Produk
          </button>
          <button
            style={activeTab === 'orders' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders
          </button>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        {/* Tab Produk */}
        {activeTab === 'products' && (
          <div>
            <div style={styles.header}>
              <h3>Daftar Produk</h3>
              <button style={styles.addBtn} onClick={() => {
                setShowForm(!showForm)
                setEditProduct(null)
                setForm({ name: '', price: '', category: '', stock: '' })
              }}>
                + Tambah Produk
              </button>
            </div>

            {/* Form Tambah/Edit */}
            {showForm && (
              <div style={styles.form}>
                <h4>{editProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h4>
                <div style={styles.formGrid}>
                  <input
                    placeholder="Nama produk"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    placeholder="Harga"
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    placeholder="Kategori (coffee, food, dll)"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    style={styles.input}
                  />
                  <input
                    placeholder="Stok"
                    type="number"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <button onClick={handleSubmit} style={styles.saveBtn}>
                  {editProduct ? 'Update' : 'Simpan'}
                </button>
              </div>
            )}

            {/* Tabel Produk */}
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={styles.tableRow}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>Rp {parseInt(product.price).toLocaleString('id-ID')}</td>
                    <td style={{ color: product.stock < 5 ? 'red' : 'green' }}>
                      {product.stock}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(product)} style={styles.editBtn}>
                        Edit
                      </button>
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
              <h3>Riwayat Order</h3>
              <button onClick={handleExport} style={styles.exportBtn}>
                📥 Export CSV
              </button>
            </div>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th>ID</th>
                  <th>Kasir</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={styles.tableRow}>
                    <td>#{order.id}</td>
                    <td>{order.cashier_name}</td>
                    <td>Rp {parseInt(order.total).toLocaleString('id-ID')}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.created_at).toLocaleString('id-ID')}</td>
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
  container: { 
    padding: '24px',
    backgroundColor: '#f5f0eb',
    minHeight: 'calc(100vh - 50px)' 
},
  tabs: { 
    display: 'flex', 
    gap: '8px', 
    marginBottom: '24px'
  },
  tab: { 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#ddd'
  },
  tabActive: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#3d2b1f',
    color: 'white' 
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  addBtn: {
    padding: '8px 16px', 
    backgroundColor: '#3d2b1f', 
    color: 'white',
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer' 
  },
  exportBtn: { 
    padding: '8px 16px',
    backgroundColor: '#2d7a2d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer' 
  },
  form: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  formGrid: { 
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', 
    gap: '12px', 
    marginBottom: '12px' },
  input: { 
    padding: '8px', 
    border: '1px solid #ddd', 
    borderRadius: '6px', 
    fontSize: '14px' },
  saveBtn: { 
    padding: '8px 20px', 
    backgroundColor: '#2d7a2d', 
    color: 'white', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    backgroundColor: 'white', 
    borderRadius: '10px', 
    overflow: 'hidden' 
  },
  tableHeader: { 
    backgroundColor: '#3d2b1f', 
    color: 'white' 
  },
  tableRow: { 
    borderBottom: '1px solid #eee' 
  },
  message: { 
    backgroundColor: '#e0ffe0', 
    color: '#2d7a2d', 
    padding: '10px', 
    borderRadius: '6px', 
    marginBottom: '16px' 
  },
  editBtn: { 
    padding: '4px 10px', 
    backgroundColor: '#f0a500', 
    color: 'white', 
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer' }
}