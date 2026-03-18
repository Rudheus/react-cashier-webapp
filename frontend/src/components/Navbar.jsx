import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>☕ Cafe Cashier</div>
      <div style={styles.right}>
        <span style={styles.username}>👤 {user?.name}</span>
        <span style={styles.role}>{user?.role}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: '#3d2b1f',
    color: 'white',
    padding: '12px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  username: {
    fontSize: '14px'
  },
  role: {
    backgroundColor: '#6b3f2a',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    textTransform: 'capitalize'
  },
  logoutBtn: {
    backgroundColor: '#cc4444',
    color: 'white',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
}