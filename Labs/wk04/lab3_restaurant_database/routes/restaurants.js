const express = require('express');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

/**
 * GET /restaurants
 * - With no query params: return all restaurant documents (all fields).
 * - With ?sortBy=ASC|DESC: return selected columns sorted by restaurant_id.
 *   Selected columns: _id, cuisine, name, city, restaurant_id.
 */
router.get('/', async (req, res) => {
  const { sortBy } = req.query;

  try {
    const query = Restaurant.find({});

    if (sortBy) {
      const direction = sortBy.toString().toLowerCase() === 'desc' ? -1 : 1;
      query
        .select({
          cuisine: 1,
          name: 1,
          city: 1,
          restaurant_id: 1,
        })
        .sort({ restaurant_id: direction });
    }

    const restaurants = await query.lean();
    res.json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

/**
 * GET /restaurants/cuisine/:cuisine
 * Return all restaurants for a cuisine (case-insensitive).
 */
router.get('/cuisine/:cuisine', async (req, res) => {
  const cuisine = req.params.cuisine;

  try {
    const restaurants = await Restaurant.find({
      cuisine: new RegExp(`^${cuisine}$`, 'i'),
    }).lean();

    res.json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants by cuisine', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

/**
 * GET /restaurants/Delicatessen
 * Return restaurants where cuisine == Delicatessen and city != Brooklyn.
 * Fields: cuisine, name, city (exclude _id), sorted by name ASC.
 */
router.get('/Delicatessen', async (_req, res) => {
  try {
    const restaurants = await Restaurant.find({
      cuisine: new RegExp('^Delicatessen$', 'i'),
      city: { $ne: 'Brooklyn' },
    })
      .select({ _id: 0, cuisine: 1, name: 1, city: 1 })
      .sort({ name: 1 })
      .lean();

    res.json(restaurants);
  } catch (err) {
    console.error('Error fetching delicatessen restaurants', err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

module.exports = router;
