import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
    .populate("serviceId") // Populate Service details
    .populate("productId"); // Populate Product details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const order = new Order(req.body);
  try {
    const savedOrder = await order.save();
    res.status(201).json({data:savedOrder});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status only
router.put('/:id', async (req, res) => {
  try {
    const { orderStatus } = req.body; // Extract orderStatus from request body

    if (!orderStatus) {
      return res.status(400).json({ message: "Order status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus }, // Only update orderStatus
      { new: true, runValidators: true } // Return updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
