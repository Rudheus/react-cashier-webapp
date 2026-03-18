const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db/index')

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Cek apakah email sudah ada
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    )
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' })
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10)

    // Simpan user baru ke database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    )

    res.status(201).json({ 
      message: 'User berhasil dibuat', 
      user: result.rows[0] 
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Cari user berdasarkan email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    )
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Email atau password salah' })
    }

    const user = result.rows[0]

    // Bandingkan password yang diinput dengan yang di database
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' })
    }
    
    //Buat JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    )

    res.json({ 
      message: 'Login berhasil', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
    
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
