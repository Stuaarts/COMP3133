const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const restaurantRouter = require('./routes/restaurants');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.warn('Warning: MONGO_URI is empty. Set it in .env to connect to MongoDB Atlas.');
}

app.use(express.json());
app.use(morgan('dev'));

// Attach routes
app.use('/restaurants', restaurantRouter);

// Simple health endpoint
app.get('/', (_, res) => {
  res.json({
    status: 'ok',
    message: 'Lab 03 Restaurant API is running',
    docs: [
      '/restaurants',
      '/restaurants?sortBy=ASC|DESC',
      '/restaurants/cuisine/<cuisine>',
      '/restaurants/Delicatessen',
    ],
  });
});

// Mongo connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
