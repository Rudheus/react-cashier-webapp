const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();
const pool = require('../db/index');
const {format} = require('fast-csv');

router.get('/sales', authenticate, authorize('manager', 'owner'), async (req, res) => {
    try {
         //Ambil data penjualan dari database
    const result = await pool.query(`
        SELECT 
            orders.id,
            users.name as cashier_name,
            orders.total,
            orders.status,
            orders.created_at
        FROM orders 
        JOIN users ON orders.cashier_id = users.id
        ORDER BY orders.created_at DESC
    `);
    //Format data ke CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sales.csv"');

    // Buat stream CSV dan kirim ke response
    const csvStream = format({ headers: true });
    
    //Pipe ke response
    csvStream.pipe(res);
    
    //tulis setiap baris
    result.rows.forEach(row => csvStream.write(row));

    //Akhiri stream
    csvStream.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Terjadi kesalahan pada server' })
     }
})

module.exports = router;