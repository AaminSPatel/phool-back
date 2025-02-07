import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Append timestamp to filename
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(file.mimetype.toLowerCase());
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG, GIF) are allowed!'));
    }
  }
});

// Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
});

// Fetch a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid product ID.', error: error.message });
  }
});

// Create a new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ success: false, message: 'Name and price are required.' });
    }

    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;
//console.log(imagePath.slice(22),imagePath);

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: imagePath, // Store relative path
      category: req.body.category,
    });

    const savedProduct = await product.save();
    res.status(201).json({ success: true, data: savedProduct, message: 'Product created successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: error.message });
  }
});

// Update an existing product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, data: updatedProduct, message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid request.', error: error.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
});

export default router;
