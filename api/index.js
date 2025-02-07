import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS
import orderRoutes from '../routes/orderRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import serviceRoutes from '../routes/serviceRoutes.js';
import customerRoutes from '../routes/customerRoutes.js'; // Import customer routes
import connectDB from '../db.js'; // Import database connection
import path from "path";

const app = express();
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(path.join(__dirname, 'public')));

dotenv.config();
connectDB(); // Connect to the database

const allowedOrigin = ['http://localhost:5173/phoolwala/', 'https://aaminspatel.github.io/phoolwala/']

const corsOptions = {
    origin: (origin,callback)=>{
        if (!origin) return callback(null, true);
        if(allowedOrigin.includes(origin)){
            callback(null,true)
        }
        else {
            callback(new Error('Not allowed by CORS'));
          }
    }
}

app.use(cors(corsOptions))


app.use(express.json()); // Middleware to parse JSON requests

// Use routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customers', customerRoutes); // Use customer routes

const PORT = process.env.PORT || 5000; // Set port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
