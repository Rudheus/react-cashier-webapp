const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middleware/auth');

//get semua user (owner only)
router.get('/', authenticate, authorize('owner'), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role FROM users ORDER BY name'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Terjadi kesalahan pada server' })
    }
})

//POST Buat User baru (owner only)
router.post('/', authenticate, authorize('owner'), async (req, res) => {
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

// PUT update user (owner only)
router.put('/:id', authenticate, authorize('owner'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Cek apakah user dengan ID tersebut ada
        const existing = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        )
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }

        // Hash password sebelum disimpan
        let hashedPassword = existing.rows[0].password
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10)
        }

        // Update user di database
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING id, name, email, role',
            [name, email, hashedPassword, role, req.params.id]
        )

        res.json({ 
            message: 'User berhasil diperbarui', 
            user: result.rows[0] 
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})
    // DELETE user (owner only)
    router.delete('/:id', authenticate, authorize('owner'), async (req, res) => {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING id',
                [req.params.id]
            )
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User tidak ditemukan' })
            }
            res.json({ message: 'User berhasil dihapus' })
        } catch (err) {
            console.error(err)
            res.status(500).json({ message: 'Server error' })
        }
    })


module.exports = router