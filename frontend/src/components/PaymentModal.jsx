import { useState } from 'react'

export default function PaymentModal({ total, onConfirm, onCancel }) {
  const [method, setMethod] = useState('cash')
  const [cashInput, setCashInput] = useState('')

  const change = method === 'cash' && cashInput
    ? parseInt(cashInput) - total
    : 0

  const isValid = method !== 'cash' || (cashInput && parseInt(cashInput) >= total)

  const paymentMethods = [
    { id: 'cash', label: '💵 Cash', color: '#2d7a2d' },
    { id: 'card', label: '💳 Card', color: '#1a6bbf' },
    { id: 'qris', label: '📱 QRIS', color: '#7b2fa8' },
    { id: 'transfer', label: '🏦 Transfer', color: '#c47a00' },
  ]

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Pilih Metode Pembayaran</h3>

        <div style={styles.totalBox}>
          <span>Total Tagihan</span>
          <span style={styles.totalAmount}>
            Rp {total.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Pilihan metode */}
        <div style={styles.methodGrid}>
          {paymentMethods.map(m => (
            <div
              key={m.id}
              style={{
                ...styles.methodCard,
                borderColor: method === m.id ? m.color : '#ddd',
                backgroundColor: method === m.id ? m.color + '15' : 'white',
                color: method === m.id ? m.color : '#333',
              }}
              onClick={() => setMethod(m.id)}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Input cash */}
        {method === 'cash' && (
          <div style={styles.cashSection}>
            <label style={styles.label}>Uang yang Dibayar</label>
            <input
              type="number"
              placeholder="Masukkan nominal"
              value={cashInput}
              onChange={e => setCashInput(e.target.value)}
              style={styles.input}
              autoFocus
            />
            {cashInput && parseInt(cashInput) >= total && (
              <div style={styles.changeBox}>
                <span>Kembalian</span>
                <span style={styles.changeAmount}>
                  Rp {change.toLocaleString('id-ID')}
                </span>
              </div>
            )}
            {cashInput && parseInt(cashInput) < total && (
              <div style={styles.errorBox}>
                Uang kurang Rp {(total - parseInt(cashInput)).toLocaleString('id-ID')}
              </div>
            )}
          </div>
        )}

        {/* Tombol aksi */}
        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Batal
          </button>
          <button
            onClick={() => onConfirm({ method, cashInput: parseInt(cashInput), change })}
            style={{ ...styles.confirmBtn, opacity: isValid ? 1 : 0.5 }}
            disabled={!isValid}
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '28px', width: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  },
  title: { margin: '0 0 20px', color: '#3d2b1f', textAlign: 'center' },
  totalBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#f5f0eb', padding: '14px 16px', borderRadius: '8px', marginBottom: '20px'
  },
  totalAmount: { fontSize: '22px', fontWeight: 'bold', color: '#3d2b1f' },
  methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' },
  methodCard: {
    padding: '14px', textAlign: 'center', borderRadius: '8px',
    border: '2px solid', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '15px', transition: 'all 0.15s ease'
  },
  cashSection: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' },
  input: {
    width: '100%', padding: '10px', border: '1px solid #ddd',
    borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box'
  },
  changeBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#e0ffe0', padding: '10px 14px', borderRadius: '6px', marginTop: '10px'
  },
  changeAmount: { fontWeight: 'bold', color: '#2d7a2d', fontSize: '18px' },
  errorBox: {
    backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px 14px',
    borderRadius: '6px', marginTop: '10px', fontSize: '14px'
  },
  actions: { display: 'flex', gap: '10px', marginTop: '8px' },
  cancelBtn: {
    flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '6px',
    cursor: 'pointer', backgroundColor: 'white', fontSize: '15px'
  },
  confirmBtn: {
    flex: 2, padding: '12px', backgroundColor: '#3d2b1f', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px'
  }
}