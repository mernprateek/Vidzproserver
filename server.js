// index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB setup
mongoose.connect('mongodb+srv://Prateek:EjCOPVeGUt3mVxBR@cluster0.ukgaesh.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Item model
const Item = mongoose.model('Item', {
  name: String,
  description: String,
  price: Number,
});

// API routes

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new item
app.post('/api/items', async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newItem = new Item({ name, description, price });
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error('Failed to add item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT (Update) an item by ID
app.put('/api/items/:id', async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Failed to update item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE an item by ID
app.delete('/api/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(deletedItem);
  } catch (error) {
    console.error('Failed to delete item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
