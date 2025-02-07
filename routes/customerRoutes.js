import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// Create a new customer
router.post('/', async (req, res) => {
  console.log(req.body.name, req.body.mobile);
  
  try {
    const customer = new Customer({
      ...req.body,
      ipAddress: req.ip // Capture the IP address
    });
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Fetch all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch a specific customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.status(200).send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a specific customer by ID
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).send();
    }
    res.status(200).send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a specific customer by ID
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.status(200).send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
