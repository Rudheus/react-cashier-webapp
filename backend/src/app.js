const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db/index');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/orders')
const exportRoutes = require('./routes/exports')
const userRoutes = require('./routes/users')

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/users', userRoutes);

app.get('/api/ping', (req, res) => {
    res.json({message : 'cashier API backend is running'})
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});