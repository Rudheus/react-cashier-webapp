import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'
import PaymentModal from '../../components/PaymentModal'
import Receipt from '../../components/Receipt'

export default function CashierDashboard() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const [lastPayment, setLastPayment] = useState(null)
  const [lastCart, setLastCart] = useState([])
  const [lastTotal, setLastTotal] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    }
  }
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  //ambil semua kategori unik dari produk
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  const addToCart = (product) => {
    const existing = cart.find(item => item.product_id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }])
    }
  }

  const removeFromCart = (product_id) => {
    setCart(cart.filter(item => item.product_id !== product_id))
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPayment(true)
  }

  const handlePaymentConfirm = async ({ method, cashInput, change }) => {
    setLoading(true)
    setShowPayment(false)
    try {
      const res = await api.post('/orders', {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        payment_method: method
      })
        
      // Simpan data untuk struk
      
      setLastOrder(res.data.order)
      setLastCart([...cart])
      setLastTotal(getTotal())
      setLastPayment({ method, change })

  
     

      setMessage(`✅ Order berhasil! Metode: ${method.toUpperCase()}${method === 'cash' ? ` | Kembalian: Rp ${change.toLocaleString('id-ID')}` : ''}`)
      setCart([])
      fetchProducts()
      setShowReceipt(true) // ← tampilkan struk

    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal membuat order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        {/* Menu Produk */}
        <div style={styles.productsSection}>
          <h3>Menu</h3>
          {/*Kategori Produk*/}
          <div style={styles.categoryTabs}>
            {categories.map(cat => (
              <button
                key={cat}
                style={{
                  ...styles.categoryTab,
                  backgroundColor: selectedCategory === cat ? '#3d2b1f' : '#ddd',
                  color: selectedCategory === cat ? 'white' : '#333',
                }}
                onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? '☕ Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
            ))}
          </div>

          {/* Tampilkan produk */}
          <div style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  ...styles.productCard,
                  opacity: product.stock === 0 ? 0.5 : 1,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: hoveredProduct === product.id
                    ? '0 8px 24px rgba(0,0,0,0.15)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => product.stock > 0 && addToCart(product)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={styles.productName}>{product.name}</div>
                <div style={styles.productCategory}>{product.category}</div>
                <div style={styles.productPrice}>
                  Rp {parseInt(product.price).toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '12px', color: product.stock === 0 ? 'red' : '#666' }}>
                  {product.stock === 0 ? '❌ Habis' : `Stok: ${product.stock}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keranjang */}
        <div style={styles.cartSection}>
          <h3>Keranjang</h3>
          {message && <div style={styles.message}>{message}</div>}
          {cart.length === 0 ? (
            <p style={{ color: '#888' }}>Keranjang kosong</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.product_id} style={styles.cartItem}>
                  <div>
                    <div>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {item.quantity} x Rp {parseInt(item.price).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    <button onClick={() => removeFromCart(item.product_id)} style={styles.removeBtn}>✕</button>
                  </div>
                </div>
              ))}
              <div style={styles.total}>
                Total: Rp {getTotal().toLocaleString('id-ID')}
              </div>
              <button
                onClick={handleCheckout}
                style={styles.checkoutBtn}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Checkout'}
              </button>
            </>
          )}
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          total={getTotal()}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPayment(false)}
        />
      )}
      {showReceipt && (
        <Receipt
          order={lastOrder}
          cart={lastCart}
          total={lastTotal}
          method={lastPayment?.method}
          change={lastPayment?.change}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    display: 'flex', gap: '24px', padding: '24px',
    backgroundColor: '#f5f0eb', minHeight: 'calc(100vh - 50px)'
  },
  productsSection: { flex: 2 },
  productsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px', marginTop: '12px'
  },
  productCard: {
    backgroundColor: 'white', padding: '16px', borderRadius: '10px'
  },
  productName: { fontWeight: 'bold', marginBottom: '4px' },
  productCategory: { fontSize: '12px', color: '#888', marginBottom: '8px', textTransform: 'capitalize' },
  productPrice: { color: '#3d2b1f', fontWeight: 'bold', marginBottom: '4px' },
  cartSection: {
    flex: 1, backgroundColor: 'white', padding: '20px',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content'
  },
  cartItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: '1px solid #eee'
  },
  removeBtn: {
    backgroundColor: '#ff4444', color: 'white', border: 'none',
    borderRadius: '4px', padding: '2px 6px', cursor: 'pointer'
  },
  total: { fontWeight: 'bold', fontSize: '18px', margin: '16px 0', textAlign: 'right' },
  checkoutBtn: {
    width: '100%', padding: '12px', backgroundColor: '#2d7a2d', color: 'white',
    border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer'
  },
  message: {
    backgroundColor: '#e0ffe0', color: '#2d7a2d',
    padding: '10px', borderRadius: '6px', marginBottom: '12px'
  }
}