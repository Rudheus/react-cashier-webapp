const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const { authenticate, authorize } = require('../middleware/auth');

//GET semua produk (semua role bisa akses)
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
        'SELECT * FROM products ORDER BY category, name'
    )
    res.json(result.rows);
  }  catch (err) {

    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
})

//GET satu produk by ID
router.get('/:id',authenticate, async (req, res) => {
    try{
        const result = await pool.query(
            'SELECT * FROM products WHERE id = $1',
            [req.params.id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({error: 'Product not found'});
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
})


//POST tambah produk baru (manager & owner only)
router.post('/', authenticate, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body
    const result = await pool.query(
      'INSERT INTO products (name, price, category, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, category, stock]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// PUT update produk (manager & owner only)
router.put('/:id', authenticate, authorize('manager', 'owner'), async (req, res) => {
  try {
    const { name, price, category, stock } = req.body
    const result = await pool.query(
      'UPDATE products SET name=$1, price=$2, category=$3, stock=$4 WHERE id=$5 RETURNING *',
      [name, price, category, stock, req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE hapus produk (owner only)
router.delete('/:id', authenticate, authorize('owner'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id=$1 RETURNING *',
      [req.params.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' })
    }
    res.json({ message: 'Produk berhasil dihapus' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router