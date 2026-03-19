const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const messOffRoutes = require('./routes/messoff'); // ✅ FIXED HERE
const feedbackRoutes = require('./routes/feedback');
const menuRoutes = require('./routes/menu');
const billRoutes = require('./routes/bill');
const munshiRoutes = require('./routes/munshi');

const { getPublicMenu, upsertPublicMenu } = require('./controllers/menuPageController');

// Logging
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.path}`);
  next();
});

// Public Menu
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Backend is working!' });
});
app.get('/api/menu/public', getPublicMenu);
app.put('/api/menu/public', upsertPublicMenu);

// Routes usage
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/mess-off', messOffRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/munshi/menu', menuRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/munshi', munshiRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});