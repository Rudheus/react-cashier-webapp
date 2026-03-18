const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const {authenticate, authorize} = require('../middleware/auth');


// POST buat order baru )cashier, manager, owner)
router.post('/', authenticate, async (req, res) => {
    const client = await pool.connect();
    try {
        const { items, payment_method } = req.body;
        // Tampilannya 
        // items = [{product_id : 1, quantity : 2}, {product_id : 2, quantity : 1}..]

        await client.query('BEGIN');

        //Hitung total dan validasi stock
        let total = 0;
        for (const item of items) {
            const product = await client.query(
                'SELECT * FROM products WHERE id = $1',
                [item.product_id]
            )
            if (product.rows.length === 0) {;
                await client.query('ROLLBACK');
                return res.status(404).json({ message : 'Produk id ${item.product_id} tidak ditemukan' });
            }
            if (product.rows[0].stock < item.quantity) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message : 'Stok ${product.rows[0].name} tidak cukup' });
            }

            total += product.rows[0].price * item.quantity;
        }

        // Simpan Orderan
        const order = await client.query(
            'INSERT INTO orders (cashier_id, total, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, total, 'pending', payment_method]
        )
          // Simpan order items dan kurangi stok
        for (const item of items) {
            const product = await client.query(
                'SELECT * FROM products WHERE id = $1',
                [item.product_id]
            )

            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_time_of_order) VALUES ($1, $2, $3, $4)',
                [order.rows[0].id, item.product_id, item.quantity, product.rows[0].price]
            )

            // Kurangi stok
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2',
                [item.quantity, item.product_id]
            )
        }
    
    await client.query('COMMIT');

    res.status(201).json({ 
        message : 'Order berhasil dibuat', 
        order : order.rows[0]
    });

} catch (err) {
        await client.query('ROLLBACK')
        console.error(err);
        res.status(500).json({ message : 'Terjadi kesalahan pada server' })
} finally {        
    client.release();
    }
})

// GET semua order (manager, & owner Only)
router.get('/', authenticate, authorize('manager', 'owner'), async (req, res) => {
    try {
       const result = await pool.query(`
      SELECT orders.*, users.name as cashier_name 
      FROM orders 
      JOIN users ON orders.cashier_id = users.id
      ORDER BY orders.created_at DESC
    `)
    res.json(result.rows)
       }catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Terjadi kesalahan pada server' })
    }
})

//GET detail satu order
router.get('/:id', authenticate, async (req, res) => {
    try{
        const order = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [req.params.id]
        )
        if (order.rows.length === 0) {
            return res.status(404).json({ message : 'Order tidak ditemukan' })
        }

        const items = await pool.query(`
            SELECT order_items.*, products.name as product_name
            FROM order_items
            JOIN products ON order_items.product_id = products.id
            WHERE order_items.order_id = $1
            `, [req.params.id])
        res.json({
            order : order.rows[0],
            items : items.rows
        })
    }catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Terjadi kesalahan pada server' })
    }
})

module.exports = router;
