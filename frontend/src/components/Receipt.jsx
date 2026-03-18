import { useRef } from 'react'

export default function Receipt({ order, cart, total, method, change, onClose }) {
  const receiptRef = useRef()

  const handlePrint = () => {
    window.print()
  }

  const now = new Date().toLocaleString('id-ID')

  const methodLabel = {
    cash: '💵 Cash',
    card: '💳 Card',
    qris: '📱 QRIS',
    transfer: '🏦 Transfer'
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Struk yang bisa diprint */}
        <div ref={receiptRef} style={styles.receipt} id="receipt">
          <div style={styles.header}>
            <div style={styles.shopName}>☕ Cafe Cashier</div>
            <div style={styles.date}>{now}</div>
            <div style={styles.orderId}>Order #{order?.id}</div>
            <div style={styles.divider}>--------------------------------</div>
          </div>

          {/* Item list */}
          <div style={styles.items}>
            {cart.map(item => (
              <div key={item.product_id} style={styles.item}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemDetail}>
                  <span>{item.quantity} x Rp {parseInt(item.price).toLocaleString('id-ID')}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.divider}>--------------------------------</div>

          {/* Total */}
          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={styles.totalAmount}>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          {/* Pembayaran */}
          <div style={styles.paymentRow}>
            <span>Pembayaran</span>
            <span>{methodLabel[method] || method}</span>
          </div>

          {/* Kembalian (hanya cash) */}
          {method === 'cash' && (
            <div style={styles.changeRow}>
              <span>Kembalian</span>
              <span>Rp {change.toLocaleString('id-ID')}</span>
            </div>
          )}

          <div style={styles.divider}>--------------------------------</div>
          <div style={styles.footer}>Terima kasih atas kunjungan Anda! 🙏</div>
        </div>

        {/* Tombol aksi */}
        <div style={styles.actions}>
          <button onClick={handlePrint} style={styles.printBtn}>
            🖨️ Print Struk
          </button>
          <button onClick={onClose} style={styles.closeBtn}>
            Tutup
          </button>
        </div>
      </div>

      {/* CSS khusus print */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt, #receipt * { visibility: visible; }
          #receipt {
            position: fixed;
            top: 0;
            left: 0;
            width: 300px;
            font-family: monospace;
          }
        }
      `}</style>
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
    padding: '24px', width: '340px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
  },
  receipt: {
    fontFamily: 'monospace', fontSize: '14px',
    padding: '16px', border: '1px dashed #ccc', borderRadius: '8px',
    marginBottom: '16px', backgroundColor: '#fafafa'
  },
  header: { textAlign: 'center', marginBottom: '12px' },
  shopName: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' },
  date: { fontSize: '12px', color: '#666' },
  orderId: { fontSize: '12px', color: '#666', marginTop: '2px' },
  divider: { color: '#ccc', margin: '10px 0', fontSize: '12px' },
  items: { marginBottom: '4px' },
  item: { marginBottom: '8px' },
  itemName: { fontWeight: 'bold', fontSize: '13px' },
  itemDetail: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '12px', color: '#555'
  },
  totalRow: {
    display: 'flex', justifyContent: 'space-between',
    fontWeight: 'bold', fontSize: '15px', margin: '8px 0'
  },
  totalAmount: { color: '#3d2b1f' },
  paymentRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '13px', color: '#555', margin: '4px 0'
  },
  changeRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '13px', color: '#2d7a2d', fontWeight: 'bold', margin: '4px 0'
  },
  footer: { textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '8px' },
  actions: { display: 'flex', gap: '10px' },
  printBtn: {
    flex: 1, padding: '10px', backgroundColor: '#3d2b1f', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  },
  closeBtn: {
    flex: 1, padding: '10px', backgroundColor: 'white', color: '#333',
    border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
  }
}