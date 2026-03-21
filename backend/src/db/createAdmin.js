const pool = require('../db/index')
const bcrypt = require('bcryptjs')

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['Admin Owner', 'owner@cafe.com', hashedPassword, 'owner'])

    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['Manager', 'manager@cafe.com', hashedPassword, 'manager'])

    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['Cashier', 'cashier@cafe.com', hashedPassword, 'cashier'])

    console.log('Users created successfully!')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

createAdmin()